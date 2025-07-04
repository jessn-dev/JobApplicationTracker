import React, { useState } from 'react';

export function ApplicationList({ applications, onEdit, onDelete }) {
    if (!applications || applications.length === 0) {
        return (
            <p className="text-gray-600 text-center py-4">No applications added yet. Start by adding one above!</p>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 rounded-bl-lg">{app.company}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{app.position}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${app.status === 'Applied' ? 'bg-blue-100 text-blue-800' : ''}
                  ${app.status === 'Interviewing' ? 'bg-purple-100 text-purple-800' : ''}
                  ${app.status === 'Offer' ? 'bg-green-100 text-green-800' : ''}
                  ${app.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                  ${app.status === 'Wishlist' ? 'bg-yellow-100 text-yellow-800' : ''}
                `}>
                  {app.status}
                </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{app.dateApplied}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs overflow-hidden text-ellipsis">{app.notes}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium rounded-br-lg">
                            <button
                                onClick={() => onEdit(app)}
                                className="text-indigo-600 hover:text-indigo-900 mr-4 transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(app.id)}
                                className="text-red-600 hover:text-red-900 transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}