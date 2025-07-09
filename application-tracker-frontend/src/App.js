import React, { useState, useEffect, useMemo } from 'react';
import { ApplicationList } from './components/ApplicationList';
import { ApplicationForm } from './components/ApplicationForm';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { HomePage } from './components/HomePage';
import { AuthPage } from './components/AuthPage';
import { Sidebar } from './components/Sidebar'; // Import the new Sidebar component
import * as XLSX from 'xlsx';

// Helper function to get a date string in INSEE-MM-DD format
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
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track authentication status
  const [showApplicationFormAndList, setShowApplicationFormAndList] = useState(false); // New state to control visibility

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
      calculateStatusCounts(data);
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
  }, [currentPage, isLoggedIn]);

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
    setShowAuthPage(false);
    setCurrentPage('tracker'); // Navigate to tracker page after login/signup
    setShowApplicationFormAndList(false); // Initially hide form/list after login
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
    alert('Logged out successfully!');
  };

  // Determine main content class based on the current page and login status
  const mainContentClass = currentPage === 'home' || showAuthPage
      ? 'w-full p-0' // Full width and no padding for homepage or auth pages
      : isLoggedIn && currentPage === 'tracker'
          ? 'flex-1 p-4 md:p-8 ml-64 transition-all duration-300' // Removed pt-4 here
          : 'container mx-auto p-4 md:p-8 pt-20'; // Centered container with padding for tracker page when not logged in, added pt-20

  return (
      <div className="min-h-screen bg-gray-100 font-sans antialiased flex">
        {/* Conditionally render Header - it will now only render when NOT logged in OR NOT on the tracker page */}
        {!isLoggedIn || currentPage !== 'tracker' ? (
            <Header
                currentPage={currentPage}
                onNavigate={setCurrentPage}
                onSignInClick={() => { setShowAuthPage(true); setAuthMode('login'); }}
                onLogout={handleLogout}
                isLoggedIn={isLoggedIn}
                setShowAuthPage={setShowAuthPage}
            />
        ) : (
            // Render nothing when logged in and on tracker page, as sidebar handles all nav/logout
            null
        )}


        {isLoggedIn && currentPage === 'tracker' && (
            <Sidebar
                onNavigate={setCurrentPage}
                onShowFormAndList={() => setShowApplicationFormAndList(true)}
                onShowDashboard={() => setShowApplicationFormAndList(false)}
                currentPage={currentPage}
                showApplicationFormAndList={showApplicationFormAndList}
                onLogout={handleLogout} // Pass logout handler to sidebar
            />
        )}

        <main className={`flex-1 ${mainContentClass}`}>
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

          {!showAuthPage && currentPage === 'tracker' && isLoggedIn && (
              <>
                {/* Always show Dashboard on tracker page when logged in, as per request */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Application Status Dashboard</h2>
                  <Dashboard allApplications={applications} statusCounts={statusCounts} />
                </div>

                {showApplicationFormAndList && (
                    <>
                      {/* Add/Edit Form Section */}
                      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                          {editingApplication ? 'Edit Application' : 'Add New Application'}
                        </h2>
                        <ApplicationForm
                            onSubmit={editingApplication ? updateApplication : addApplication}
                            initialData={editingApplication}
                            onCancel={handleCancelEdit}
                        />
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
              </>
          )}

          {!showAuthPage && currentPage === 'tracker' && !isLoggedIn && (
              <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] bg-white rounded-lg shadow-md p-8 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                <p className="text-gray-600 mb-6">Please sign in to view your application tracker.</p>
                <button
                    onClick={() => { setShowAuthPage(true); setAuthMode('login'); }}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out"
                >
                  Sign In
                </button>
              </div>
          )}
        </main>
      </div>
  );
}

export default App;