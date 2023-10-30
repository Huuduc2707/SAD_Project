from django.db import models
from user.models import User

from django.utils import timezone
from datetime import timedelta

from django.db.models.query import QuerySet


# Create your models here.

class ParkingFloor(models.Model):
    floor_index = models.IntegerField(unique=True, blank=False, null=False)
    floor_name = models.CharField(unique=True, max_length=255, blank=False, null=False)
    
    def __str__(self):
        return f'{self.floor_name}-{self.floor_index}' 
    
class ParkingSlot(models.Model):
    
    class SlotStatus(models.TextChoices):
        EMPTY = "E", "Empty"
        BOOKED = "B", "Booked"
        USED = "U", "Used"
    
    floor = models.ForeignKey(to=ParkingFloor, on_delete=models.CASCADE)
    
    start_x = models.IntegerField(null=True, blank=True)
    end_x = models.IntegerField(null=True, blank=True)
    start_y = models.IntegerField(null=True, blank=True)
    end_y = models.IntegerField(null=True, blank=True)
    status = models.CharField(max_length=1, 
                              choices=SlotStatus.choices, 
                              default=SlotStatus.EMPTY)
    
    def __str__(self):
        return f'{self.floor.floor_index}-{self.id}'
    
class VehicleType(models.Model):
    name = models.CharField(max_length=255, blank=False, null=False)
    hourly_fee = models.FloatField(default=0.0, blank=False, null=False)
    
    def __str__(self):
        return self.name
    
class Vehicle(models.Model):
    plate_number = models.CharField(unique=True, max_length=255, blank=False, null=False)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    vehicle_type = models.ForeignKey(to=VehicleType, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.plate_number
    
    
class ReservationManager(models.Manager):
    def conflict_reservations(self, user=None):
        return self.filter(user=user
                        ,status=Reservation.StatusChoices.AVAILABLE
                        ,time_booked__gte=timezone.now() - timedelta(minutes=30))
    
class Reservation(models.Model):
    
    class StatusChoices(models.TextChoices):
        AVAILABLE = "A", "Available"
        EXPIRED = "E", "Expired"
        CHECKED = "C", "Checked-in"
    
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    vehicle = models.ForeignKey(to=Vehicle, on_delete=models.CASCADE)
    slot = models.ForeignKey(to=ParkingSlot, on_delete=models.CASCADE)
    time_booked = models.DateTimeField(default=timezone.now, blank=False)
    status = models.CharField(max_length=1, 
                              choices=StatusChoices.choices,
                              default=StatusChoices.AVAILABLE,
                              )
    
    objects = ReservationManager()

    
    @staticmethod
    def handle_conflict_reservation(user=None):
        conflicted_objs = Reservation.objects.conflict_reservations(user)
        for obj in conflicted_objs:
            obj.status = Reservation.StatusChoices.EXPIRED
            obj.slot.status = ParkingSlot.SlotStatus.EMPTY
            obj.save()
            obj.slot.save()
        
    def check_expired_conflict(self):
        
        time_difference = timezone.now() - self.time_booked
        is_expired = time_difference.total_seconds() >= 30 * 60 
        
        if is_expired and self.status == Reservation.StatusChoices.AVAILABLE:
            self.status = Reservation.StatusChoices.EXPIRED
            self.slot.status = ParkingSlot.SlotStatus.EMPTY
            self.save()
            self.slot.save()
        return self
            
    def save(self, *args, **kwargs):
        # Update slot status when a reservation is created
        if not self.pk:  # Check if the reservation is being created
            self.slot.status = ParkingSlot.SlotStatus.BOOKED
            self.slot.save()

        super().save(*args, **kwargs)
        
    def delete(self, *args, **kwargs):
        # Change slot status to "Empty" before deleting the reservation
        if self.slot.status == ParkingSlot.SlotStatus.BOOKED:
            self.slot.status = ParkingSlot.SlotStatus.EMPTY
            self.slot.save()
            print("called")

        super().delete(*args, **kwargs)
    
    class Meta:
        ordering = ['-time_booked']
    
class CheckIn(models.Model):
    
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    time_in = models.DateTimeField(default=timezone.now, blank=False, null=False)
    time_out = models.DateTimeField(default=None, blank=True, null=True)
    vehicle = models.ForeignKey(to=Vehicle, on_delete=models.CASCADE)
    slot = models.ForeignKey(to=ParkingSlot, on_delete=models.CASCADE)
    fee = models.FloatField(default=None, blank=True, null=True)
    
    def total_fee(self):
        if self.time_out is None:
            # If time_out is not set, fee is not calculable
            return None

        # Calculate the time difference
        time_difference = self.time_out - self.time_in
        
        # Calculate the total hours, rounded up to the next hour
        total_hours = (time_difference.total_seconds() + 3599) // 3600
        
        # Retrieve the hourly fee from the related VehicleType
        hourly_fee = self.vehicle.vehicle_type.hourly_fee
        
        # Calculate the total fee
        fee = total_hours * hourly_fee
        
        return fee
    
    def save(self, *args, **kwargs):
        # Update slot status when a checkin is created
        if not self.pk:  # Check if the checkin is being created
            self.slot.status = ParkingSlot.SlotStatus.USED
            self.slot.save()

        super().save(*args, **kwargs)

class BankAccount(models.Model):

    bank_name = models.CharField(max_length=20,
                                 null=False, 
                                 blank=False)
    
    account_number =  models.CharField(max_length=20, 
                                       null=False, 
                                       blank=False)
    
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    
    def __str__(self):
        return f'{self.bank_name} - {self.account_number}'
    
class Bill(models.Model):
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    check_in = models.ForeignKey(to=CheckIn, on_delete=models.CASCADE)
    bank_account = models.ForeignKey(to=BankAccount, on_delete=models.CASCADE)
    payment_time = models.DateTimeField(default=timezone.now, blank=False, null=False)

    def total_fee(self):
        return self.check_in.fee