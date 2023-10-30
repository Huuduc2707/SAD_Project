from ninja import Schema, ModelSchema
from ..models import (ParkingFloor, ParkingSlot 
                    ,VehicleType, Vehicle)

class ParkingFloorIn(Schema):
    floor_index: int
    floor_name: str

class ParkingSlotIn(Schema):
    start_x: int = None
    end_x: int = None
    start_y: int = None
    end_y: int = None

class VehicleTypeIn(Schema):
    name: str
    hourly_fee: float
    
class VehicleTypePut(Schema):
    name: str = None
    hourly_fee: float = None
    
class VehicleIn(Schema):
    plate_number: str
    vehicle_type: int
    
class VehiclePut(Schema):
    plate_number: str = None
    vehicle_type: int = None
    
class BankAccountIn(Schema):
    bank_name: str
    account_number: str
    
class BankAccountPut(Schema):
    bank_name: str = None
    account_number: str = None
    
class ReservationIn(Schema):
    vehicle_id: int
    slot_id: int
    
class CheckInIn(Schema):
    vehicle_id: int
    floor_id: int
    
class CheckOutIn(Schema):
    vehicle_id: int
    floor_id: int = None
    slot_id: int = None
    
class BillIn(Schema):
    check_in_id: int
    bank_account_id: int
