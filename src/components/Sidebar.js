import React from 'react';
import { useBills } from '../context/BillContext';

const Sidebar = ({ currentView, onViewChange }) => {
  const { statistics, exportToCSV } = useBills();

  const handleExport = async () => {
    try {
      await exportToCSV();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Facturel</h1>
        <p className="text-sm text-gray-500 mt-1">Bill Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => onViewChange('dashboard')}
          className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
            currentView === 'dashboard'
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z" />
            </svg>
            Dashboard
          </div>
        </button>

        <button
          onClick={() => onViewChange('new-bill')}
          className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Bill
          </div>
        </button>
      </nav>

      {/* Statistics */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Active Bills:</span>
            <span className="font-medium">{statistics.totalBills || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Payments:</span>
            <span className="font-medium">{statistics.totalPayments || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">This Year:</span>
            <span className="font-medium">${(statistics.thisYearTotal || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleExport}
          className="w-full btn-secondary text-sm"
        >
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;