import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './components/pages/testpage/LandingPage';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import Layouts from './components/layout/Layouts';
import ProtectedRoute from './protected/ProtectedRoute';
import { AuthProvider } from './authcontext/AuthContext';
import Booking from './components/pages/landingpage/booking/Booking';

const App = () => {
  return (
    <AuthProvider>
      <div className='app'>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <Layouts>
                  <AdminDashboard />
                </Layouts>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute role="user">
                <LandingPage>
                  <Booking/>
                </LandingPage>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
