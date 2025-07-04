import React, { useState, useEffect, useMemo } from 'react';
import { ApplicationList } from './components/ApplicationList';
import { ApplicationForm } from './components/ApplicationForm';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { HomePage } from './components/HomePage';
import { AuthPage } from './components/AuthPage'; // Import the new combined AuthPage
import * as XLSX from 'xlsx';

// Helper function to get a date string in YYYY-MM-DD format
const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function App() {
  const [applications, setApplications] = useState([]);
  const [editingApplication, setEditingApplication] = useState(null);
  const [statusCounts, setStatusCounts] = useState({});
  const [currentPage, setCurrentPage] = useState('home');
  const [showAuthPage, setShowAuthPage] = useState(false); // State to control AuthPage visibility
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track authentication status

  // Base URL for your Spring Boot backend
  const API_BASE_URL = 'http://localhost:8080/api/applications';

  // Function to fetch all applications from the backend
  const fetchApplications = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setApplications(data);
      calculateStatusCounts(data); // Calculate counts for the dashboard
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // Function to calculate status counts (for the Dashboard)
  const calculateStatusCounts = (apps) => {
    const counts = {};
    const allStatuses = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Wishlist'];

    allStatuses.forEach(status => {
      counts[status] = 0;
    });

    apps.forEach(app => {
      if (app.status && counts.hasOwnProperty(app.status)) {
        counts[app.status]++;
      } else if (app.status) {
        counts[app.status] = (counts[app.status] || 0) + 1;
      }
    });
    setStatusCounts(counts);
  };

  // Fetch applications on component mount (only if on tracker page and logged in)
  useEffect(() => {
    if (currentPage === 'tracker' && isLoggedIn) {
      fetchApplications();
    }
  }, [currentPage, isLoggedIn]); // Re-fetch when page changes to tracker or login status changes

  const addApplication = async (_id, application) => {
    try {
      const requestBody = JSON.stringify(application);
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      };
      const response = await fetch(API_BASE_URL, fetchOptions);
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = await response.json();
          errorMessage += `, message: ${errorJson.message || JSON.stringify(errorJson)}`;
        } catch (e) {
          const errorText = await response.text();
          errorMessage += `, raw response: ${errorText}`;
        }
        throw new Error(errorMessage);
      }
      fetchApplications();
    } catch (error) {
      console.error("Error adding application:", error);
      alert(`Failed to add application: ${error.message}`);
    }
  };

  const updateApplication = async (id, application) => {
    try {
      const requestBody = JSON.stringify(application);
      const fetchOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      };
      const response = await fetch(`${API_BASE_URL}/${id}`, fetchOptions);
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = await response.json();
          errorMessage += `, message: ${errorJson.message || JSON.stringify(errorJson)}`;
        } catch (e) {
          const errorText = await response.text();
          errorMessage += `, raw response: ${errorText}`;
        }
        throw new Error(errorMessage);
      }
      fetchApplications();
      setEditingApplication(null);
    } catch (error) {
      console.error("Error updating application:", error);
      alert(`Failed to update application: ${error.message}`);
    }
  };

  const deleteApplication = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorJson = await response.json();
          errorMessage += `, message: ${errorJson.message || JSON.stringify(errorJson)}`;
        } catch (e) {
          const errorText = await response.text();
          errorMessage += `, raw response: ${errorText}`;
        }
        throw new Error(errorMessage);
      }
      const updatedApplications = applications.filter(app => app.id !== id);
      setApplications(updatedApplications);
      calculateStatusCounts(updatedApplications);
    } catch (error) {
      console.error("Error deleting application:", error);
      alert(`Failed to delete application: ${error.message}`);
    }
  };

  const handleEdit = (application) => {
    setEditingApplication(application);
  };

  const handleCancelEdit = () => {
    setEditingApplication(null);
  };

  // Handle successful login/signup
  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setShowAuthPage(false); // Hide auth page
    setCurrentPage('tracker'); // Navigate to tracker page after login/signup
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home'); // Go to home page after logout
    alert('Logged out successfully!');
  };

  // Determine main content class based on the current page
  const mainContentClass = currentPage === 'home' || showAuthPage
      ? 'w-full p-0' // Full width and no padding for homepage or auth pages
      : 'container mx-auto p-4 md:p-8'; // Centered container with padding for tracker page

  return (
      <div className="min-h-screen bg-gray-100 font-sans antialiased">
        <Header
            currentPage={currentPage}
            onNavigate={setCurrentPage}
            onLoginClick={() => { setShowAuthPage(true); setAuthMode('login'); }}
            onSignupClick={() => { setShowAuthPage(true); setAuthMode('signup'); }}
            onLogout={handleLogout}
            isLoggedIn={isLoggedIn}
        />
        <main className={mainContentClass}>
          {showAuthPage && (
              <AuthPage
                  mode={authMode}
                  onAuthSuccess={handleAuthSuccess}
                  onClose={() => setShowAuthPage(false)}
                  onSwitchMode={(mode) => setAuthMode(mode)}
              />
          )}

          {!showAuthPage && currentPage === 'home' && (
              <HomePage onNavigate={setCurrentPage} />
          )}

          {!showAuthPage && currentPage === 'tracker' && isLoggedIn && ( // Only show tracker if logged in
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Dashboard Section */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Status Dashboard</h2>
                    <Dashboard allApplications={applications} statusCounts={statusCounts} />
                  </div>

                  {/* Add/Edit Form Section */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                      {editingApplication ? 'Edit Application' : 'Add New Application'}
                    </h2>
                    <ApplicationForm
                        onSubmit={editingApplication ? updateApplication : addApplication}
                        initialData={editingApplication}
                        onCancel={handleCancelEdit}
                    />
                  </div>
                </div>

                {/* Application List Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Applications</h2>
                  <ApplicationList
                      applications={applications}
                      onEdit={handleEdit}
                      onDelete={deleteApplication}
                  />
                </div>
              </>
          )}

          {!showAuthPage && currentPage === 'tracker' && !isLoggedIn && (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                <p className="text-gray-600 mb-6">Please log in to view your application tracker.</p>
                <button
                    onClick={() => { setShowAuthPage(true); setAuthMode('login'); }}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                >
                  Log In
                </button>
              </div>
          )}
        </main>
      </div>
  );
}

export default App;