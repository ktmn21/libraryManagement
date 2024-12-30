import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Welcome from './components/common/Welcome';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserDashboard from './components/user/UserDashboard';
import UserProfile from './components/user/UserProfile';
import AdminDashboard from './components/admin/AdminDashboard';
import PrivateRoute from './components/common/PrivateRoute';
import AdminUserProfile from './components/admin/AdminUserProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={
            <PrivateRoute role="USER">
              <UserDashboard />
            </PrivateRoute>
          } />
          <Route path="/user/profile" element={
            <PrivateRoute role="USER">
              <UserProfile />
            </PrivateRoute>
          } />
          <Route path="/admin/*" element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route 
            path="/admin/user/:userId" 
            element={
              <PrivateRoute role="ADMIN">
                <AdminUserProfile />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
