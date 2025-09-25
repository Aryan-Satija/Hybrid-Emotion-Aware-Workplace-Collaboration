from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_401_UNAUTHORIZED
from ..domain.employee.employee_datastore import EmployeeDataStore
from ..utils.auth import create_access_token

class Login(ViewSet):

    def login(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password required"}, status=HTTP_400_BAD_REQUEST)

        try:
            employee = EmployeeDataStore.verify_employee(email, password)
            token = create_access_token(employee.id)
            return Response({
                "token": token,
                "employee": {
                    "id": employee.id,
                    "first_name": employee.first_name,
                    "last_name": employee.last_name,
                    "email": employee.email,
                    "role": employee.role,
                    "company_id": employee.company_id
                }
            }, status=HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Invalid credentials"}, status=HTTP_401_UNAUTHORIZED)
