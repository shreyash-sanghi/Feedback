import {React ,useEffect} from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import AdminVerify from './components/AdminVerify'
import AdminDashboard from './components/AdminDashboard'
import FeedbackDashboard from './components/FeedbackDashboard'
import { Navigate } from 'react-router-dom'
import Dashboard from './components/Dashboard'
export default function App() {
  useEffect(() => {
    if (window.location.pathname === '/') {
      window.location.href = 'https://www.payclick.co.in/Web/Default.aspx';
    }
  }, []);
  return (
    <div>
<Routes>

  <Route path='/:id' Component={Home}/>
  <Route path='/login_dashboard' Component={AdminVerify}/>
  <Route path='/dashboard' Component={Dashboard}/>
  <Route path='/admin_dashboard' Component={AdminDashboard}/>
  <Route path='/feedback' Component={FeedbackDashboard}/>

</Routes>
    </div>
  )
}
