from ninja import Schema, ModelSchema
from ..models import User
from typing import Any
from ninja_jwt.schema import TokenObtainPairInputSchema


class UserSchema(ModelSchema):
    class Config:
        model = User
        model_fields = ['id', 'username', 'email', 'name', 'phone_number', 'role'] 

class UserTokenResponse(Schema):
    refresh: str
    access: str
    user: UserSchema

class UserTokenObtainSchema(TokenObtainPairInputSchema):

    def output_schema(self):
        out_dict = self.dict(exclude={"password"})
        out_dict.update(user=UserSchema.from_orm(self._user))
        return UserTokenResponse(**out_dict)

