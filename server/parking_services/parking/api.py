from ninja import NinjaAPI, Router
from ninja_extra import api_controller, http_get, http_post, http_put, http_delete


from user.models import User
from .models import (ParkingFloor, ParkingSlot, VehicleType
                    , Vehicle, BankAccount, Bill, CheckIn
                    , Reservation)

from .schema.response import (ParkingFloorOut, ParkingSlotOut, VehicleTypeOut,
                              VehicleOut, BankAccountOut, ReservationOut, CheckInOut,
                              CheckOut, BillOut, ReservationHistoryOut,
                              CheckOutHistory, BillHistoryOut)
from .schema.payload import (ParkingFloorIn, ParkingSlotIn, VehicleTypeIn,
                             VehicleIn, VehiclePut, BankAccountIn, BankAccountPut,
                             ReservationIn, CheckInIn, CheckOutIn, BillIn)

from user.schema.response import UserSchema

from typing import List

from django.shortcuts import get_object_or_404

from parking_services.exceptions import (InvalidInformation, PlateNumberDuplication,
                                         NotFound, NoSlotAvailable)

from parking_services.authenticate import ManagerCustomAuth

from ninja_jwt.authentication import JWTAuth

from django.utils import timezone



@api_controller('/floors', tags=["Floor"], auth=JWTAuth())
class FloorController:
    @http_get('', response=List[ParkingFloorOut])
    def get_list_floor(self, request):
        return ParkingFloor.objects.all()
    
    @http_post('', response=ParkingFloorOut)
    def create_floor(self, request, payload: ParkingFloorIn):
        try:
            created_floor = ParkingFloor.objects.create(**payload.dict())
            return created_floor
        except:
            raise InvalidInformation()
        
    @http_put('/{floor_id}', response=ParkingFloorOut)
    def update_floor(self, request, floor_id: int, payload: ParkingFloorIn):
        try:
            current_floor = get_object_or_404(ParkingFloor, pk=floor_id)
            for attr, value in payload.dict().items():
                setattr(current_floor, attr, value)
            current_floor.save()
            return current_floor
        except:
            raise InvalidInformation()
        
    @http_delete('/{floor_id}')
    def delete_floor(self, request, floor_id: int):
        try:
            ParkingFloor.objects.get(pk=floor_id).delete()
            return True
        except ParkingFloor.DoesNotExist:
            raise NotFound()
        except:
            raise InvalidInformation()
        
    @http_get('/{floor_id}/slots', response=List[ParkingSlotOut], auth=JWTAuth())
    def get_list_slots(self, request, floor_id):
        return ParkingSlot.objects.filter(floor=floor_id)
    
    @http_post('/{floor_id}/slots', response=ParkingSlotOut)
    def create_slot(self, request, floor_id: int, payload: ParkingSlotIn):
        current_floor = get_object_or_404(ParkingFloor, pk=floor_id)
        created_slot = ParkingSlot.objects.create(floor=current_floor, **payload.dict())
        return created_slot
    
    @http_put('/{floor_id}/slots/{slot_id}', response=ParkingSlotOut)
    def update_slot(self, request, floor_id: int, slot_id: int, payload: ParkingSlotIn):
        current_slot = get_object_or_404(ParkingSlot, pk=slot_id)
        if current_slot.floor.id != floor_id:
            raise NotFound()
        for attr, value in payload.dict().items():
            setattr(current_slot, attr, value)
        current_slot.save()
        return current_slot
    
    @http_delete('/{floor_id}/slots/{slot_id}')
    def delete_slot(self, request, floor_id: int, slot_id: int):
        current_slot = get_object_or_404(ParkingSlot, pk=slot_id)
        if current_slot.floor.id != floor_id:
            raise NotFound()
        current_slot.delete()
        return True


@api_controller('/vehicle_types', tags=["Vehicle Type"], auth=JWTAuth())
class VehicleTypeController:
    @http_get('', response=List[VehicleTypeOut])
    def get_list_vehicle_type(self, request):
        return VehicleType.objects.all()
    
    @http_post('', response=VehicleTypeOut)
    def create_vehicle_type(self, request, payload: VehicleTypeIn):
        try:
            created_type = VehicleType.objects.create(**payload.dict())
            return created_type
        except:
            raise InvalidInformation()
        
    @http_put('/{vehicle_type_id}', response=VehicleTypeOut)
    def update_vehicle_type(self, request, vehicle_type_id: int, payload: VehicleTypeIn):
        try:
            current_type = get_object_or_404(VehicleType, pk=vehicle_type_id)
            for attr, value in payload.dict().items():
                setattr(current_type, attr, value)
            current_type.save()
            return current_type
        except:
            raise InvalidInformation()
        
    @http_delete('/{vehicle_type_id}')
    def delete_vehicle_type(self, request, vehicle_type_id: int):
        try:
            VehicleType.objects.get(pk=vehicle_type_id).delete()
            return True
        except VehicleType.DoesNotExist:
            raise NotFound()
        except:
            raise InvalidInformation()


@api_controller('/vehicles', tags=["Vehicle"], auth=JWTAuth())
class VehicleController:
    @http_get('', response=List[VehicleOut])
    def get_list_vehicle(self, request):
        return Vehicle.objects.filter(user=request.user)
    
    @http_post('', response=VehicleOut)
    def create_vehicle(self, request, payload: VehicleIn):
        try:
            if Vehicle.objects.filter(plate_number=payload.plate_number).exists():
                raise PlateNumberDuplication
            vehicle_type = get_object_or_404(VehicleType, pk=payload.vehicle_type)
            created_vehicle = Vehicle.objects.create(user=request.user,
                                                    vehicle_type=vehicle_type,
                                                    plate_number=payload.plate_number)
            return created_vehicle
        except:
            raise InvalidInformation()
        
    @http_put('/{vehicle_id}', response=VehicleOut)
    def update_vehicle(self, request, vehicle_id: int, payload: VehiclePut):
        try:
            current_vehicle = get_object_or_404(Vehicle, pk=vehicle_id)
            if payload.plate_number is not None:
                if VehicleType.objects.filter(plate_number=payload.plate_number).exists():
                    raise PlateNumberDuplication
                current_vehicle.plate_number = payload.plate_number
            if payload.vehicle_type is not None:
                vehicle_type = get_object_or_404(VehicleType, pk=payload.vehicle_type)
                current_vehicle.vehicle_type = vehicle_type
            current_vehicle.save()
            return current_vehicle
        except:
            raise InvalidInformation()
        
    @http_delete('/{vehicle_id}')
    def delete_vehicle(self, request, vehicle_id: int):
        try:
            Vehicle.objects.get(pk=vehicle_id).delete()
            return True
        except Vehicle.DoesNotExist:
            raise NotFound()
        except:
            raise InvalidInformation()     

@api_controller('/bank', tags=["Bank Account"], auth=JWTAuth())
class BankAccountController:
    @http_get('', response=List[BankAccountOut])
    def get_list_bank_account(self, request):
        return BankAccount.objects.filter(user=request.user)
    
    @http_post('', response=BankAccountOut)
    def create_bank_account(self, request, payload: BankAccountIn):
        try:
            created_bank_account = BankAccount.objects.create(user=request.user, **payload.dict())
            return created_bank_account
        except:
            raise InvalidInformation()
        
    @http_put('/{bank_account_id}', response=BankAccountOut)
    def update_bank_account(self, request, bank_account_id: int, payload: BankAccountPut):
        try:
            current_bank_account = get_object_or_404(BankAccount, pk=bank_account_id)
            for attr, value in payload.dict().items():
                setattr(current_bank_account, attr, value)
            current_bank_account.save()
            return current_bank_account
        except:
            raise InvalidInformation()
        
    @http_delete('/{bank_account_id}')
    def delete_bank_aacount(self, request, bank_account_id: int):
        try:
            BankAccount.objects.get(pk=bank_account_id).delete()
            return True
        except BankAccount.DoesNotExist:
            raise NotFound()
        except:
            raise InvalidInformation()   

@api_controller('/reservations', tags=["Reservations"], auth=JWTAuth())
class ReservationController:
    @http_get('', response=List[ReservationOut])
    def get_all_reservation_of_user(self, request):
        Reservation.handle_conflict_reservation(request.user)
        
        return Reservation.objects.filter(user=request.user)
    
    @http_get('/floor/{floor_id}', response=List[ReservationOut])
    def get_all_reservation_by_floor(self, request, floor_id: int):
        Reservation.handle_conflict_reservation()
        
        reservations = (Reservation.objects.select_related('slot__floor')
                                   .filter(slot__floor__id=floor_id))
        return reservations
    
    @http_delete('/{reservation_id}')
    def delete_reservations(self, request, reservation_id: int):
        Reservation.objects.get(pk=reservation_id).delete()
        return True
    
    @http_get('/{reservation_id}', response=ReservationOut)
    def get_a_reservation_by_id(self, request, reservation_id: int):
        reservations = get_object_or_404(Reservation, pk=reservation_id)
        reservations = reservations.check_expired_conflict()
        return reservations

    @http_post('', response=ReservationOut)
    def create_reservation(self, request, payload: ReservationIn):
        try:
            #REMEMBER TO CHANGE TO PLATE NUMBER
            current_vehicle= get_object_or_404(Vehicle, pk=payload.vehicle_id)
            current_slot= get_object_or_404(ParkingSlot, pk=payload.slot_id)
            
            created_reservation = Reservation.objects.create(user=request.user,
                                                             vehicle=current_vehicle,
                                                             slot=current_slot)
            return created_reservation
        except:
            raise InvalidInformation()
        
    
@api_controller('/checkin', tags=["Check In"], auth=JWTAuth())
class CheckInController:
    
    @http_get('/{check_in_id}', response=CheckInOut)
    def get_user_check_in(self, request, check_in_id:int):
        return CheckIn.objects.filter(id=check_in_id)
    
    @http_get('', response=List[CheckInOut])
    def get_all_user_check_in(self, request):
        return CheckIn.objects.filter(user=request.user)

    @http_post('', response=CheckInOut)
    def check_in_user(self, request, payload: CheckInIn):
        try:

            current_vehicle= get_object_or_404(Vehicle, pk=payload.vehicle_id)
            reservation_qs = Reservation.objects.filter(user=request.user,
                                                        vehicle=current_vehicle,
                                                        status=Reservation.StatusChoices.AVAILABLE)
            if reservation_qs.exists():
                current_reservation = reservation_qs.first()
                current_reservation.status = Reservation.StatusChoices.CHECKED
                current_reservation.save()
                current_slot = current_reservation.slot
            else:
                current_floor= get_object_or_404(ParkingFloor, pk=payload.floor_id)
            
                parking_slots = ParkingSlot.objects.filter(floor=current_floor,
                                                            status=ParkingSlot.SlotStatus.EMPTY)

                if not parking_slots.exists():
                    raise NoSlotAvailable
            
                current_slot = parking_slots.first()
            
            created_check_in = CheckIn.objects.create(user=request.user,
                                                    vehicle=current_vehicle,
                                                    slot=current_slot)
            return created_check_in
        except:
            raise InvalidInformation()
        
@api_controller('/checkout', tags=["Check Out"], auth=JWTAuth())
class CheckOutController:
    
    @http_get('', response=List[CheckOut])
    def get_user_check_out_history(self, request):
        try:
            return CheckIn.objects.filter(user=request.user, time_out__isnull=False)
        except:
            raise InvalidInformation()

    @http_post('', response=CheckOut)
    def check_out_user(self, request, payload: CheckOutIn):
        try:
            current_slot = get_object_or_404(ParkingSlot, pk=payload.slot_id)
            current_vehicle = get_object_or_404(Vehicle, pk=payload.vehicle_id)
            current_check_in = get_object_or_404(CheckIn, 
                                                 user=request.user,
                                                 slot=current_slot,
                                                 vehicle=current_vehicle)
            
            current_check_in.slot.status = ParkingSlot.SlotStatus.EMPTY
            current_check_in.time_out = timezone.now()
            current_check_in.fee = current_check_in.total_fee()
            current_check_in.slot.save()
            current_check_in.save()
            
            return current_check_in
        except:
            raise InvalidInformation()
        
@api_controller('/bill', tags=["Pay Bill"], auth=JWTAuth())
class BillController:
    
    @http_get('', response=List[BillOut])
    def get_all_user_bill_history(self, request):
        return Bill.objects.filter(user=request.user)

    @http_post('', response=BillOut)
    def pay_bill(self, request, payload: BillIn):
        try:
            current_bank_account = get_object_or_404(BankAccount, pk=payload.bank_account_id)
            current_check_in = get_object_or_404(CheckIn, pk=payload.check_in_id)
            
            created_bill = Bill.objects.create(user=request.user,
                                               check_in=current_check_in,
                                               bank_account=current_bank_account)
            
            return created_bill
        except:
            raise InvalidInformation()
        

@api_controller('/employee', tags=["Employees"], auth=JWTAuth())
class EmployeeController:
    
    @http_get('', response=List[ReservationOut])
    def get_all_employee(self, request):
        return User.employees.all()
    
@api_controller('/manage', tags=["Manage"], auth=JWTAuth())
class ManageController:
    
    @http_get('/reservation', response=List[ReservationHistoryOut])
    def get_all_reservations(self, request):
        return Reservation.objects.all()
    
    @http_get('/checkin', response=List[CheckOutHistory])
    def get_all_checkin(self, request):
        return CheckIn.objects.all()
    
    @http_get('/bill', response=List[BillHistoryOut])
    def get_all_bill_history(self, request):
        return Bill.objects.all()
