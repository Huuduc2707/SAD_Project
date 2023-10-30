from django.contrib import admin
from .models import (ParkingFloor, ParkingSlot, Reservation,
                     VehicleType, Vehicle,
                     CheckIn, BankAccount, Bill)
# Register your models here.

models_to_register = [ParkingFloor, ParkingSlot, Reservation,
                     VehicleType, Vehicle,
                     CheckIn, BankAccount, Bill]

for model in models_to_register:
    admin.site.register(model)