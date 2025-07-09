import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { Info, Download } from 'lucide-react'; // Import Lucide icons

// Helper function to get a date string in INSEE-MM-DD format
const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export function Dashboard({ allApplications, statusCounts }) {
    const [dateFilter, setDateFilter] = useState('last7days'); // Default to last 7 days
    const [activeStatuses, setActiveStatuses] = useState([]);

    // Updated COLORS to match the image's segments more closely
    const COLORS = {
        'Applied': '#4285F4', // Blue (Direct)
        'Interviewing': '#DB4437', // Red (Sponsor)
        'Offer': '#F4B400', // Yellow (Affiliate)
        'Rejected': '#0F9D58', // Green (Email marketing)
        'Wishlist': '#AB47BC', // Purple (A new color for wishlist)
    };

    const filteredApplicationsForDashboard = useMemo(() => {
        let filtered = allApplications;
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date to start of day

        if (dateFilter === 'today') {
            filtered = allApplications.filter(app => new Date(app.dateApplied).toDateString() === today.toDateString());
        } else if (dateFilter === 'yesterday') {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            filtered = allApplications.filter(app => new Date(app.dateApplied).toDateString() === yesterday.toDateString());
        } else if (dateFilter === 'last7days') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 6);
            sevenDaysAgo.setHours(0, 0, 0, 0); // Normalize to start of day

            filtered = allApplications.filter(app => {
                const appDate = new Date(app.dateApplied);
                appDate.setHours(0, 0, 0, 0); // Normalize app date to start of day
                return appDate >= sevenDaysAgo && appDate <= today;
            });
        }
        return filtered;
    }, [allApplications, dateFilter]);

    const filteredStatusCounts = useMemo(() => {
        const counts = {};
        const allStatuses = ['Applied', 'Interviewing', 'Offer', 'Rejected', 'Wishlist'];
        allStatuses.forEach(status => {
            counts[status] = 0;
        });
        filteredApplicationsForDashboard.forEach(app => {
            if (app.status && counts.hasOwnProperty(app.status)) {
                counts[app.status]++;
            } else if (app.status) {
                counts[app.status] = (counts[app.status] || 0) + 1;
            }
        });
        return counts;
    }, [filteredApplicationsForDashboard]);

    useEffect(() => {
        setActiveStatuses(Object.keys(filteredStatusCounts).filter(status => filteredStatusCounts[status] > 0));
    }, [filteredStatusCounts]);

    const toggleStatus = (statusName) => {
        setActiveStatuses(prevActiveStatuses => {
            if (prevActiveStatuses.includes(statusName)) {
                return prevActiveStatuses.filter(name => name !== statusName);
            } else {
                return [...prevActiveStatuses, statusName];
            }
        });
    };

    const chartData = Object.keys(filteredStatusCounts)
        .filter(status => activeStatuses.includes(status))
        .map(status => ({
            name: status,
            value: filteredStatusCounts[status],
        }))
        .filter(item => item.value > 0);

    const activeTotalApplications = chartData.reduce((sum, entry) => sum + entry.value, 0);

    const exportToExcel = () => {
        if (filteredApplicationsForDashboard.length === 0) {
            alert("No applications to export based on current filter.");
            return;
        }

        const dataToExport = filteredApplicationsForDashboard.map(app => ({
            ID: app.id,
            Company: app.company,
            Position: app.position,
            Status: app.status,
            'Date Applied': app.dateApplied,
            'Last Updated': app.lastUpdated ? new Date(app.lastUpdated).toLocaleString() : 'N/A',
            Notes: app.notes
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Job Applications");
        XLSX.writeFile(workbook, "JobApplications.xlsx");
    };

    return (
        <div className="flex flex-col gap-4 bg-gray-800 p-6 rounded-lg shadow-md text-white"> {/* Dark background */}
            {/* Header section with title and icons */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                    <span>Application Status Overview</span>
                    <Info size={16} className="text-gray-400 cursor-pointer" title="Information about your application statuses" />
                </h2>
                <button
                    onClick={exportToExcel}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                    title="Download data"
                >
                    <Download size={20} />
                </button>
            </div>

            {/* Removed Checkbox filters (Desktop, Tablet, Mobile) */}

            {filteredApplicationsForDashboard.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No applications found for the selected date filter.</p>
            ) : (
                <div className="flex flex-col items-center justify-center gap-6"> {/* Changed to flex-col for vertical stacking */}
                    {/* Radial Chart (Donut Chart) using Recharts */}
                    <div className="relative w-72 h-72 flex items-center justify-center"> {/* Increased size to w-72 h-72 */}
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={90} // Increased inner radius
                                    outerRadius={110} // Increased outer radius
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    isAnimationActive={true}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Centering the total count and label */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                            <div className="text-xl font-bold text-white">
                                {activeTotalApplications}
                            </div>
                            <div className="text-sm text-gray-400">
                                Total Applications
                            </div>
                        </div>
                    </div>

                    {/* Status List and Percentages (Legend/Filter) - Moved below the chart, made inline and smaller */}
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 w-full mt-4"> {/* Changed to flex-wrap and justify-center with gap */}
                        {Object.keys(filteredStatusCounts).map(status => {
                            const count = filteredStatusCounts[status];
                            const percentage = activeTotalApplications > 0 ? (count / activeTotalApplications) * 100 : 0;
                            const isActive = activeStatuses.includes(status);

                            return (
                                <div
                                    key={status}
                                    className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm cursor-pointer transition-all duration-200 ${
                                        isActive ? 'bg-gray-700' : 'opacity-70 hover:bg-gray-700'
                                    }`}
                                    onClick={() => toggleStatus(status)}
                                >
                                    <span className={`inline-block w-2 h-2 rounded-full`} style={{ backgroundColor: COLORS[status] }}></span>
                                    <span className="text-gray-200 font-medium">{status}</span>
                                    <span className="text-gray-400">({count})</span> {/* Display count next to status */}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {/* Footer section with date filter */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                <div className="relative group">
                    <select
                        id="dateFilter"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="appearance-none bg-gray-700 text-white px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium pr-8 cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                    >
                        <option value="last7days">Last 7 days</option>
                        <option value="today">Today</option>
                        <option value="yesterday">Yesterday</option>
                        <option value="all">All Time</option>
                    </select>
                    {/* Tooltip for date filter */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 whitespace-nowrap">
                        Filter applications by date applied
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                    </div>
                </div>
                {/* Removed Traffic Analysis Link */}
            </div>
        </div>
    );
}
