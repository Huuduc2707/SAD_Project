from ninja_jwt.authentication import JWTAuth, JWTBaseAuthentication
from ninja_extra.security import HttpBearer
from django.http import HttpRequest
from user.models import User
from ninja_extra.exceptions import PermissionDenied
from ninja_jwt.tokens import RefreshToken

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class ManagerCustomAuth(JWTBaseAuthentication, HttpBearer):
    def authenticate(self, request: HttpRequest, token: str):
        current_user = self.jwt_authenticate(request, token)
        if current_user.role != User.Role.MANAGER:
            raise PermissionDenied()
        return current_user