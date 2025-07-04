import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';

// Helper function to get a date string in YYYY-MM-DD format
const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export function Dashboard({ allApplications, statusCounts }) {
    const [dateFilter, setDateFilter] = useState('all');
    const [activeStatuses, setActiveStatuses] = useState([]);

    const COLORS = {
        'Applied': '#3B82F6',    // blue-500
        'Interviewing': '#8B5CF6', // purple-500
        'Offer': '#22C55E',       // green-500
        'Rejected': '#EF4444',    // red-500
        'Wishlist': '#F59E0B',    // yellow-500
    };

    const filteredApplicationsForDashboard = useMemo(() => {
        let filtered = allApplications;
        const today = new Date();
        const todayStr = getFormattedDate(today);

        if (dateFilter === 'today') {
            filtered = allApplications.filter(app => app.dateApplied === todayStr);
        } else if (dateFilter === 'yesterday') {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const yesterdayStr = getFormattedDate(yesterday);
            filtered = allApplications.filter(app => app.dateApplied === yesterdayStr);
        } else if (dateFilter === 'last7days') {
            const sevenDaysAgo = new Date(today);
            sevenDaysAgo.setDate(today.getDate() - 6);
            sevenDaysAgo.setHours(0, 0, 0, 0);

            filtered = allApplications.filter(app => {
                const appDate = new Date(app.dateApplied);
                appDate.setHours(0, 0, 0, 0);
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
        <div className="flex flex-col gap-4">
            {/* Filter Dropdown for Dashboard */}
            <div className="flex flex-wrap gap-2 items-center">
                <label htmlFor="dateFilter" className="text-sm font-medium text-gray-700 mr-2">Filter by Date Applied:</label>
                <select
                    id="dateFilter"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                >
                    <option value="all">All</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7days">Past 7 Days</option>
                </select>
            </div>

            {filteredApplicationsForDashboard.length === 0 ? (
                <p className="text-gray-600 text-center py-4">No applications found for the selected date filter.</p>
            ) : (
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    {/* Radial Chart (Donut Chart) using Recharts */}
                    <div className="relative w-48 h-48 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
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
                            <div className="text-xl font-bold text-gray-800">
                                {activeTotalApplications}
                            </div>
                            <div className="text-sm text-gray-600">
                                Total
                            </div>
                        </div>
                    </div>

                    {/* Status List and Percentages (Legend/Filter) */}
                    <div className="flex flex-col space-y-2 w-full md:w-1/2">
                        {Object.keys(filteredStatusCounts).map(status => { // Use filteredStatusCounts for legend
                            const count = filteredStatusCounts[status];
                            const percentage = activeTotalApplications > 0 ? (count / activeTotalApplications) * 100 : 0; // Percentage based on active total
                            const isActive = activeStatuses.includes(status);

                            return (
                                <div
                                    key={status}
                                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all duration-200 ${
                                        isActive ? 'bg-gray-100' : 'opacity-60 hover:bg-gray-50'
                                    }`}
                                    onClick={() => toggleStatus(status)}
                                >
                                    <div className="flex items-center">
                                        <span className={`inline-block w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: COLORS[status] }}></span>
                                        <span className="text-gray-700 font-medium">{status}</span>
                                    </div>
                                    <span className="text-gray-600">{count} ({percentage.toFixed(1)}%)</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {/* Export to Excel Button for Dashboard with Tooltip */}
            <div className="relative group self-center md:self-start">
                <button
                    onClick={exportToExcel}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Export Filtered to Excel
                </button>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10 whitespace-nowrap">
                    Download current dashboard data as Excel
                    {/* Tooltip Arrow */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800"></div>
                </div>
            </div>
        </div>
    );
}