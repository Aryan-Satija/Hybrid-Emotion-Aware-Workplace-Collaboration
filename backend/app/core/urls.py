from django.urls import path
from .viewsets.employee import Employee
from .viewsets.company import Company
from .viewsets.auth import Login

employee_list = Employee.as_view({"get": "list", "post": "create"})
employee_detail = Employee.as_view(
    {"get": "retrieve", "put": "update", "delete": "destroy"}
)
company_list = Company.as_view({"post": "create"})
company_detail = Company.as_view(
    {"get": "retrieve", "put": "update", "delete": "destroy"}
)

urlpatterns = [
    path("companies/<str:company_id>/employees/", employee_list, name="employee-list"),
    path(
        "companies/<str:company_id>/employees/<str:pk>/",
        employee_detail,
        name="employee-detail",
    ),
    path("auth/login/", Login.as_view({"post": "login"})),
    path("companies/", company_list, name="company-list"),
    path("companies/<str:company_id>/", company_detail, name="company-detail"),
]
