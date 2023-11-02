from ninja import NinjaAPI, Router
from ninja_extra import NinjaExtraAPI, api_controller, http_get, http_post, http_put
from ninja_extra.exceptions import AuthenticationFailed
from .models import User
from .schema.response import (UserSchema,UserTokenResponse, UserTokenObtainSchema)
from .schema.payload import (CustomerRegisterRequest, CustomerProfileRequest)
from typing import List

from ninja_jwt.authentication import JWTAuth

from parking_services.exceptions import UsernameDuplication

# signup(give information -> return confirmation ), 
# login(give username, password -> return jwt), 
# profile(give jwt -> get info)
# edit(give jwt, info -> return updated info)

@api_controller('/user', tags=['User'])
class UserController:
    
    @http_get('', response=UserSchema, auth=JWTAuth())
    def get_user(self, request):
        return request.user
    
    @http_post('/signup')
    def sign_up_user(self, request, payload: CustomerRegisterRequest):
        if User.customers.filter(username=payload.username).exists():
            raise UsernameDuplication()
        created_user = User.objects.create_user(**payload.dict())
        return True

    @http_post('/login', response=UserTokenResponse)
    def login_user(self, user_token: UserTokenObtainSchema):
        user_token.check_user_authentication_rule()
        return user_token.output_schema()
    
    @http_put('/edit_profile', response=UserSchema, auth=JWTAuth())
    def edit_user_profile(self, request, payload:CustomerProfileRequest):
        current_user = request.user
        for attr, value in payload.dict().items():
            setattr(current_user, attr, value)
        current_user.save()
        return current_user
    


