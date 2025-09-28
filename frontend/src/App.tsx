import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/login/login'
import { Signup } from './pages/signup/signup'
import { Dashboard } from './pages/dashboard/dashboard'
import { CreateAdmin } from './pages/admin/admin'
import { AdminDashboard } from './pages/adminDashboard/adminDashboard'
import { EmployeeSchedule } from './pages/employeeSchedule/EmployeeSchedule'
function App() {

  return (
    <div>
      <Routes>
        <Route path="/login" element={ <Login/> } />
        <Route path="/register" element={ <Signup/> } />
        <Route path="/dashboard" element={ <Dashboard/> } />
        <Route
          path="/admin/companies/:companyId/register"
          element={<CreateAdmin />}
        />
        <Route
          path="/admin/companies/:companyId/create"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/companies/:companyId/schedule"
          element={<EmployeeSchedule />}
        />
      </Routes>
    </div>
  )
}

export default App
