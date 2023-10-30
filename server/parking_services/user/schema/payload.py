from ninja import Schema

class CustomerRegisterRequest(Schema):
    username: str
    password: str
    email: str
    name: str = None
    phone_number: str = None
    
class CustomerProfileRequest(Schema):
    email: str = None
    name: str = None
    phone_number: str = None