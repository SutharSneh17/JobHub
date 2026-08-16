// File Path: frontend/src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Jobs from './pages/Jobs';
import JobDescription from './pages/JobDescription';
import Companies from './pages/admin/Companies';
import CompanyCreate from './pages/admin/CompanyCreate';
import CompanySetup from './pages/admin/CompanySetup';
import AdminJobs from './pages/admin/AdminJobs';
import PostJob from './pages/admin/PostJob';
import Applicants from './pages/admin/Applicants';
import Profile from './pages/Profile';
import Status from './pages/Status';
import { Toaster } from 'sonner';
import RecruiterDashboard from './pages/admin/RecruiterDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/description/:id" element={<JobDescription />} />
          <Route path="/status" element={<Status />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Recruiter Workspace Admin Pathways */}
          <Route path="/admin/dashboard" element={<RecruiterDashboard />} /> {/* NEW: Analytics Dashboard */}
          <Route path="/admin/companies" element={<Companies />} />
          <Route path="/admin/companies/create" element={<CompanyCreate />} />
          <Route path="/admin/companies/:id" element={<CompanySetup />} />
          <Route path="/admin/jobs" element={<AdminJobs />} />
          <Route path="/admin/jobs/create" element={<PostJob />} />
          <Route path="/admin/jobs/applicants/:id" element={<Applicants />} />
        </Routes>
        <Toaster position="bottom-right" richColors />
      </div>
    </BrowserRouter>
  );
}

export default App;