import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/home.jsx'
import HomeLayout from './layouts/homeLayout.jsx'
import Rooms from './pages/rooms/rooms.jsx'
import Footer from './components/footer/footer.jsx'
import Login from './auth/login/login.jsx'
import './App.css'

function App() {

  return (
    <div class="body">

      <Login />

      {/* <Routes>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/rooms" element={<Rooms />} />
      </Routes> */}

      {/* <Footer /> */}
      
    </div>
  )

}

export default App
