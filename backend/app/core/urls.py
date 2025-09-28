from django.urls import path
from .viewsets.events import Event
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

event_list = Event.as_view({"get": "list", "post": "create"})
event_detail = Event.as_view(
    {"get": "retrieve", "put": "update", "delete": "destroy"}
)

urlpatterns = [
    # Employee endpoints
    path("companies/<str:company_id>/employees/", employee_list, name="employee-list"),
    path(
        "companies/<str:company_id>/employees/<str:pk>/",
        employee_detail,
        name="employee-detail",
    ),

    # Company endpoints
    path("companies/", company_list, name="company-list"),
    path("companies/<str:company_id>/", company_detail, name="company-detail"),

    # Auth
    path("auth/login/", Login.as_view({"post": "login"})),

    # Event endpoints
    path("events/", event_list, name="event-list"),
    path("events/<str:event_id>/", event_detail, name="event-detail"),

    # Custom: all occurrences for a given employee between start & end
    path(
        "events/employee/<str:employee_id>/",
        Event.as_view({"get": "employee_events"}),
        name="employee-events",
    ),
]
