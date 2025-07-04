import React, { useState, useEffect } from 'react';
import { ApplicationList } from './components/ApplicationList';
import { ApplicationForm } from './components/ApplicationForm';
import { Header } from './components/Header';
import * as XLSX from 'xlsx'; // Import the xlsx library
// import './App.css'; // Removed as styling is primarily handled by Tailwind CSS and this file was not provided

function App() {
  const [applications, setApplications] = useState([]);
  const [editingApplication, setEditingApplication] = useState(null); // State for application being edited

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
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Function to add a new application - updated to accept two arguments
  const addApplication = async (_id, application) => { // _id will be null for new applications
    try {
      // Log the application object *immediately before* stringifying it
      console.log("Application object received in addApplication:", application);

      const requestBody = JSON.stringify(application); // Stringify the application object
      console.log("Stringified request body:", requestBody); // Log the result of stringify

      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody, // Use the stringified body
      };
      console.log("Preparing fetch POST request with options:", fetchOptions);

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

  // Function to update an existing application
  const updateApplication = async (id, application) => {
    try {
      // Log the application object *immediately before* stringifying it
      console.log("Application object received in updateApplication:", application);

      const requestBody = JSON.stringify(application); // Stringify the application object
      console.log("Stringified request body:", requestBody); // Log the result of stringify

      const fetchOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody, // Use the stringified body
      };
      console.log("Preparing fetch PUT request with options:", fetchOptions);

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

  // Function to delete an application
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
      setApplications(applications.filter(app => app.id !== id));
    } catch (error) {
      console.error("Error deleting application:", error);
      alert(`Failed to delete application: ${error.message}`);
    }
  };

  // Function to set an application for editing
  const handleEdit = (application) => {
    setEditingApplication(application);
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditingApplication(null);
  };

  // Function to export applications to Excel
  const exportToExcel = () => {
    if (applications.length === 0) {
      alert("No applications to export.");
      return;
    }

    // Map the application data to a format suitable for Excel
    const dataToExport = applications.map(app => ({
      ID: app.id,
      Company: app.company,
      Position: app.position,
      Status: app.status,
      'Date Applied': app.dateApplied, // Handle spaces in header names
      Notes: app.notes
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Job Applications");

    // Generate and download the Excel file
    XLSX.writeFile(workbook, "JobApplications.xlsx");
  };


  return (
      <div className="min-h-screen bg-gray-100 font-sans antialiased">
        <Header />
        <main className="container mx-auto p-4 md:p-8">
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

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Applications</h2>
            <button
                onClick={exportToExcel}
                className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Export to Excel
            </button>
            <ApplicationList
                applications={applications}
                onEdit={handleEdit}
                onDelete={deleteApplication}
            />
          </div>
        </main>
      </div>
  );
}

export default App;
