"""
URL configuration for parking_services project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from ninja_extra import NinjaExtraAPI

#import api from apps
from ninja_jwt.controller import NinjaJWTDefaultController
from user.api import UserController
from parking.api import (FloorController, VehicleTypeController
                        ,VehicleController, BankAccountController
                        ,ReservationController, CheckInController
                        ,CheckOutController, BillController,
                        EmployeeController, ManageController)

api = NinjaExtraAPI()

api.register_controllers(
    UserController,
    FloorController,
    VehicleTypeController,
    VehicleController,
    BankAccountController,
    ReservationController,
    CheckInController,
    CheckOutController,
    BillController,
    EmployeeController,
    ManageController,
    
    NinjaJWTDefaultController,
    
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls)
]
