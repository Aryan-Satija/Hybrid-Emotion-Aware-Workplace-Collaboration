from ...models.company import Company
from ...models.employee import Employee
from .beans_factory import EmployeeBeanFactory
from ...utils.auth import compare_passwords

class EmployeeDataStore:
    @staticmethod
    def list_employees(company_id):
        company = Company.objects.get(id=company_id)
        employees = Employee.objects(company=company)
        return [EmployeeBeanFactory.from_model(employee) for employee in employees]

    @staticmethod
    def get_employee(employee_id):
        employee = Employee.objects.get(id=employee_id)
        return EmployeeBeanFactory.from_model(employee)

    @staticmethod
    def verify_employee(email_id, password):
        employee = Employee.objects.get(email=email_id)
        
        if not compare_passwords(password, employee.password):
            raise ValueError("Invalid email or password") 
            
        return EmployeeBeanFactory.from_model(employee)

    @staticmethod
    def create_employee(company_id, data):
        company = Company.objects.get(id=company_id)
        employee = Employee(company=company, **data)
        employee.save()
        return EmployeeBeanFactory.from_model(employee)

    @staticmethod
    def delete_employee(employee_id):
        employee = Employee.objects.get(id=employee_id)
        employee.delete()

    @staticmethod
    def update_employee(employee_id, data):
        employee = Employee.objects.get(id=employee_id)
        for key, value in data.items():
            setattr(employee, key, value)
        employee.save()
        return EmployeeBeanFactory.from_model(employee)
