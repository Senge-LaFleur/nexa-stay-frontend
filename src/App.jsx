import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/home/home.jsx'
import HomeLayout from './layouts/homeLayout.jsx'
import Rooms from './pages/rooms/rooms.jsx'
import Login from './pages/auth/login/login.jsx'
import Signup from './pages/auth/signup/signup.jsx';
import Dashboard from './pages/dashboard/dashboard.jsx';
import RoomsTable from './pages/roomsTable/roomsTable.jsx';
import Client from './pages/client/client.jsx';
import Reservation from './pages/reservation/reservation.jsx';
import Payments from './pages/payments/payments.jsx';
import Reviews from './pages/review/review.jsx';
import Payment from './pages/payment/payment.jsx';
import Logout from './pages/auth/logout/logout.jsx';
import PrivateRoute from './routes/PrivateRoute.jsx';
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="body">
        <Routes>
          <Route path="/" element={<HomeLayout />}>
            <Route index element={<Home />} />
          </Route>
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />

          <Route path="/roomsTable" element={<PrivateRoute element={<RoomsTable />} requiredRole="ADMIN" />} />
          <Route path="/payment" element={<PrivateRoute element={<Payment />} />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} requiredRole="ADMIN" />} />
          <Route path="/client" element={<PrivateRoute element={<Client />} requiredRole="ADMIN" />} />
          <Route path="/reservation" element={<PrivateRoute element={<Reservation />} />} />
          <Route path="/payments" element={<PrivateRoute element={<Payments />} requiredRole="ADMIN" />} />
          <Route path="/reviews" element={<PrivateRoute element={<Reviews />} requiredRole="ADMIN" />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
