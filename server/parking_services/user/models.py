from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractUser, UserManager
from django.utils import timezone
from uuid import uuid4

from django.db.models.query import QuerySet



# Create your models here.

class ManagersManager(models.Manager): #little bit clumsy 
    def get_queryset(self) -> QuerySet:
        return super().get_queryset().filter(role=User.Role.MANAGER)
    
class CustomersManager(models.Manager): 
    def get_queryset(self) -> QuerySet:
        return super().get_queryset().filter(role=User.Role.CUSTOMER)
    
class EmployeesManager(models.Manager): 
    def get_queryset(self) -> QuerySet:
        return super().get_queryset().filter(role=User.Role.EMPLOYEE)

class User(AbstractUser):
    
    class Role(models.TextChoices):
        MANAGER = "M", 'Manager'
        EMPLOYEE = "E", 'Employee'
        CUSTOMER = "C", 'Customer'
    
    uuid = models.UUIDField(unique=True, default=uuid4, editable=False)
    name = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=12, blank=True, null=True)
    role = models.CharField(max_length=1, choices=Role.choices, default=Role.CUSTOMER)
    
    objects = UserManager()
    
    managers = ManagersManager()
    customers = CustomersManager()
    employees = EmployeesManager()
    
    
    
    def __str__(self):
        return self.username
    
    def is_customer(self):
        return self.role == User.Role.CUSTOMER
    
    def is_manager(self):
        return self.role == User.Role.MANAGER
    
    def is_employee(self):
        return self.role == User.Role.EMPLOYEE
    
    