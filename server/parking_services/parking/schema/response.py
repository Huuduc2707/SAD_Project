from ninja import Schema, ModelSchema
from ..models import (ParkingFloor, ParkingSlot 
                    , VehicleType, Vehicle, BankAccount
                    , Bill, Reservation, CheckIn)


class ParkingFloorOut(ModelSchema):
    class Config:
        model = ParkingFloor
        model_fields = "__all__"
        
class ParkingSlotOut(ModelSchema):
    class Config:
        model = ParkingSlot
        model_exclude = ['floor']
        
class VehicleTypeOut(ModelSchema):
    class Config:
        model = VehicleType
        model_fields = "__all__"
        
class VehicleOut(ModelSchema):
    
    class VehicleTypeFormatOut(ModelSchema):
        class Config:
            model = VehicleType
            model_fields = ["name"]
            
    vehicle_type: VehicleTypeFormatOut
    
    class Config:
        model = Vehicle
        model_exclude = ['user']
        
class BankAccountOut(ModelSchema):
    class Config:
        model = BankAccount
        model_fields = ["id", "bank_name", "account_number"]
        
class ReservationOut(ModelSchema):
    class Config:
        model = Reservation
        model_exclude = ['user']
    
    class SlotOut(ModelSchema):
        class Config:
            model = ParkingSlot
            model_fields = "__all__"
        floor: ParkingFloorOut
            
    slot: SlotOut
    vehicle: VehicleOut
    time_booked: str
    
    @staticmethod
    def resolve_time_booked(obj):
        return obj.time_booked.isoformat()
        
class CheckInOut(ModelSchema):
    class Config:
        model = CheckIn
        model_fields = ['id', 'vehicle', 'slot', 'time_in']
        
class CheckOut(ModelSchema):
    class Config:
        model = CheckIn
        model_fields = ['id', 'vehicle', 'slot', 'time_in', 'time_out', 'fee']
        
class BillOut(Schema):
    check_in: CheckOut
    bank_account: BankAccountOut
    payment_time: str
    total_fee: float
    
    @staticmethod
    def resolve_payment_time(obj):
        return obj.payment_time.isoformat() 
    
    @staticmethod
    def resolve_total_fee(obj):
        return obj.total_fee()
        

        