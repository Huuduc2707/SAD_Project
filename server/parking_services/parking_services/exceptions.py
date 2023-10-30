from ninja_extra.exceptions import APIException, NotFound
from ninja_extra import status

class UsernameDuplication(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Username already existed'
    default_code = "username_register_failed"
    
class PlateNumberDuplication(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Plate number already existed'
    default_code = "plate_number_register_failed"
    
class NoSlotAvailable(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'No slot is available in this floor'
    default_code = "no_slot_available"
    
class DataDuplication(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Input data is duplicated in database'
    default_code = "duplicated_data"
    
    
class InvalidInformation(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'Invalid input data'
    default_code = "invalid_input_data"
    