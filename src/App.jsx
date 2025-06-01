import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/home.jsx'
import HomeLayout from './layouts/homeLayout.jsx'
import Rooms from './pages/rooms/rooms.jsx'
import Login from './pages/auth/login/login.jsx'
import Signup from './pages/auth/signup/signup.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx'
import Client from './pages/client/client.jsx';
import Reservation from './pages/reservation/reservation.jsx';
import Payments from './pages/payments/payments.jsx';
import Payment from './pages/payment/payment.jsx';
import Logout from './pages/auth/logout/logout.jsx';
import './App.css'

function App() {

  return (
    <div class="body">


      <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/client" element={<Client />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>

      
    </div>
  )

}

export default App
