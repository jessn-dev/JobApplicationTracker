
import React, { useState, useEffect } from 'react';

export function ApplicationForm({ onSubmit, initialData, onCancel }) {
    const [company, setCompany] = useState('');
    const [position, setPosition] = useState('');
    const [status, setStatus] = useState('Applied');
    const [dateApplied, setDateApplied] = useState('');
    const [notes, setNotes] = useState('');

    // Populate form fields when initialData (for editing) changes
    useEffect(() => {
        if (initialData) {
            setCompany(initialData.company || '');
            setPosition(initialData.position || '');
            setStatus(initialData.status || 'Applied');
            setDateApplied(initialData.dateApplied || '');
            setNotes(initialData.notes || '');
        } else {
            // Clear form when no initialData is provided (for new application)
            setCompany('');
            setPosition('');
            setStatus('Applied');
            setDateApplied('');
            setNotes('');
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!company || !position || !dateApplied) {
            alert('Company, Position, and Date Applied are required fields.');
            return;
        }

        const application = { company, position, status, dateApplied, notes };
        onSubmit(initialData ? initialData.id : null, application);
        if (!initialData) {
            setCompany('');
            setPosition('');
            setStatus('Applied');
            setDateApplied('');
            setNotes('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                <input
                    type="text"
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
                <input
                    type="text"
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Wishlist">Wishlist</option>
                </select>
            </div>
            <div>
                <label htmlFor="dateApplied" className="block text-sm font-medium text-gray-700">Date Applied</label>
                <input
                    type="date"
                    id="dateApplied"
                    value={dateApplied}
                    onChange={(e) => setDateApplied(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
                {initialData && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    {initialData ? 'Update Application' : 'Add Application'}
                </button>
            </div>
        </form>
    );
}