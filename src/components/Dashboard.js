import React, { useEffect, useState } from 'react';
import { useBills } from '../context/BillContext';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';

const Dashboard = ({ onViewChange }) => {
  const { bills, statistics, loading, error, loadBills } = useBills();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadBills();
  }, []);

  const getFilteredBills = () => {
    const now = new Date();
    const nextWeek = addDays(now, 7);

    switch (filter) {
      case 'due-soon':
        return bills.filter(bill => 
          bill.next_due_date && 
          isAfter(parseISO(bill.next_due_date), now) &&
          isBefore(parseISO(bill.next_due_date), nextWeek)
        );
      case 'overdue':
        return bills.filter(bill => 
          bill.next_due_date && 
          isBefore(parseISO(bill.next_due_date), now)
        );
      default:
        return bills;
    }
  };

  const filteredBills = getFilteredBills();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={loadBills} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your bills and payments</p>
          </div>
          <button 
            onClick={() => onViewChange('new-bill')}
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Bill
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Bills</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.totalBills || 0}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-full">
                <svg className="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Year</p>
                <p className="text-2xl font-semibold text-gray-900">${(statistics.thisYearTotal || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-full">
                <svg className="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Payment</p>
                <p className="text-2xl font-semibold text-gray-900">${(statistics.averagePayment || 0).toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Payments</p>
                <p className="text-2xl font-semibold text-gray-900">{statistics.totalPayments || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Bills ({bills.length})
          </button>
          <button
            onClick={() => setFilter('due-soon')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'due-soon' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Due Soon
          </button>
          <button
            onClick={() => setFilter('overdue')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'overdue' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overdue
          </button>
        </div>

        {/* Bills List */}
        {filteredBills.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No bills yet' : `No ${filter.replace('-', ' ')} bills`}
            </h3>
            <p className="text-gray-500 mb-4">
              {filter === 'all' 
                ? 'Get started by adding your first bill.'
                : 'Great! You don\'t have any bills in this category.'
              }
            </p>
            {filter === 'all' && (
              <button 
                onClick={() => onViewChange('new-bill')}
                className="btn-primary"
              >
                Add Your First Bill
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBills.map(bill => (
              <BillCard 
                key={bill.id} 
                bill={bill} 
                onViewChange={onViewChange} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BillCard = ({ bill, onViewChange }) => {
  const getDueDateStatus = () => {
    if (!bill.next_due_date) return 'no-date';
    
    const now = new Date();
    const dueDate = parseISO(bill.next_due_date);
    const daysDiff = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return 'overdue';
    if (daysDiff <= 7) return 'due-soon';
    return 'upcoming';
  };

  const getStatusColor = () => {
    const status = getDueDateStatus();
    switch (status) {
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'due-soon': return 'text-yellow-600 bg-yellow-100';
      case 'upcoming': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = () => {
    if (!bill.next_due_date) return 'No due date';
    
    const status = getDueDateStatus();
    const dueDate = parseISO(bill.next_due_date);
    const daysDiff = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
    
    switch (status) {
      case 'overdue': return `Overdue by ${Math.abs(daysDiff)} days`;
      case 'due-soon': return `Due in ${daysDiff} days`;
      case 'upcoming': return format(dueDate, 'MMM d, yyyy');
      default: return format(dueDate, 'MMM d, yyyy');
    }
  };

  return (
    <div 
      className="card hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onViewChange('bill-details', bill)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
            {bill.logo_path ? (
              <img 
                src={bill.logo_path} 
                alt={bill.name} 
                className="w-8 h-8 rounded object-cover"
              />
            ) : (
              <span className="text-primary-600 font-semibold text-lg">
                {bill.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-gray-900">{bill.name}</h3>
            <p className="text-sm text-gray-500">
              {bill.recurrence_type ? `${bill.recurrence_type.charAt(0).toUpperCase()}${bill.recurrence_type.slice(1)}` : 'One-time'}
            </p>
          </div>
        </div>
      </div>

      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </div>

      {bill.tags && bill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {bill.tags.slice(0, 3).map(tag => (
            <span 
              key={tag.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag.name}
            </span>
          ))}
          {bill.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{bill.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewChange('new-payment', bill);
          }}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Log Payment
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewChange('edit-bill', bill);
          }}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default Dashboard;