import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/login/login'
import { Signup } from './pages/signup/signup'
import { Dashboard } from './pages/dashboard/dashboard'
import { CreateAdmin } from './pages/admin/admin'
function App() {

  return (
    <div className="p-6">
      <Routes>
        <Route path="/login" element={ <Login/> } />
        <Route path="/register" element={ <Signup/> } />
        <Route path="/dashboard" element={ <Dashboard/> } />
        <Route
          path="/register/companies/:companyId/admin"
          element={<CreateAdmin />}
        />
      </Routes>
    </div>
  )
}

export default App
