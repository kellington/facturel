import React, { useEffect, useState } from 'react';
import { useBills } from '../context/BillContext';
import { format, parseISO } from 'date-fns';

const BillDetails = ({ bill, onBack, onViewChange }) => {
  const { loadPayments, payments, deleteBill, archiveBill } = useBills();
  const [billPayments, setBillPayments] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (bill) {
      loadPayments(bill.id);
    }
  }, [bill, loadPayments]);

  useEffect(() => {
    setBillPayments(payments.filter(payment => payment.bill_id === bill?.id));
  }, [payments, bill]);

  const handleDelete = async () => {
    try {
      await deleteBill(bill.id);
      onBack();
    } catch (error) {
      console.error('Failed to delete bill:', error);
    }
  };

  const handleArchive = async () => {
    try {
      await archiveBill(bill.id);
      onBack();
    } catch (error) {
      console.error('Failed to archive bill:', error);
    }
  };

  const openPaymentUrl = () => {
    if (bill.payment_url) {
      window.open(bill.payment_url, '_blank');
    }
  };

  const getTotalPaid = () => {
    return billPayments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getAveragePayment = () => {
    return billPayments.length > 0 ? getTotalPaid() / billPayments.length : 0;
  };

  const getLastPayment = () => {
    return billPayments.length > 0 ? billPayments[0] : null;
  };

  if (!bill) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500">No bill selected</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="text-gray-400 hover:text-gray-600 mr-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
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
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{bill.name}</h1>
                  <p className="text-gray-600 mt-1">
                    {bill.recurrence_type ? 
                      `${bill.recurrence_type.charAt(0).toUpperCase()}${bill.recurrence_type.slice(1)} bill` : 
                      'One-time bill'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {bill.payment_url && (
                <button
                  onClick={openPaymentUrl}
                  className="btn-secondary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Pay Bill
                </button>
              )}
              <button
                onClick={() => onViewChange('new-payment', bill)}
                className="btn-primary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Log Payment
              </button>
              <button
                onClick={() => onViewChange('edit-bill', bill)}
                className="btn-secondary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bill Information */}
            <div className="lg:col-span-1">
              <div className="card mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Bill Information</h2>
                
                <div className="space-y-4">
                  {bill.next_due_date && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Next Due Date</label>
                      <p className="text-gray-900 font-medium">
                        {format(parseISO(bill.next_due_date), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  )}
                  
                  {bill.recurrence_type && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Recurrence</label>
                      <p className="text-gray-900 capitalize">{bill.recurrence_type}</p>
                    </div>
                  )}
                  
                  {bill.due_day && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Due Day</label>
                      <p className="text-gray-900">{bill.due_day}{getDaySuffix(bill.due_day)} of each {bill.recurrence_type?.replace('ly', '') || 'month'}</p>
                    </div>
                  )}
                  
                  {bill.notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Notes</label>
                      <p className="text-gray-900">{bill.notes}</p>
                    </div>
                  )}
                  
                  {bill.tags && bill.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tags</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {bill.tags.map(tag => (
                          <span 
                            key={tag.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Statistics */}
              <div className="card mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Statistics</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Payments:</span>
                    <span className="font-medium">{billPayments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Paid:</span>
                    <span className="font-medium">${getTotalPaid().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Payment:</span>
                    <span className="font-medium">${getAveragePayment().toFixed(2)}</span>
                  </div>
                  {getLastPayment() && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Payment:</span>
                      <span className="font-medium">
                        ${getLastPayment().amount.toFixed(2)} on {format(parseISO(getLastPayment().payment_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="card">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                
                <div className="space-y-3">
                  <button
                    onClick={handleArchive}
                    className="w-full text-left px-4 py-2 text-yellow-700 hover:bg-yellow-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l4 4 4-4m6 0l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 8m5 3v6m4-6v6" />
                    </svg>
                    Archive Bill
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Bill
                  </button>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
                  <button
                    onClick={() => onViewChange('new-payment', bill)}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    + Add Payment
                  </button>
                </div>

                {billPayments.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No payments yet</h3>
                    <p className="text-gray-500 mb-4">Start tracking by logging your first payment.</p>
                    <button
                      onClick={() => onViewChange('new-payment', bill)}
                      className="btn-primary"
                    >
                      Log First Payment
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {billPayments.map(payment => (
                      <PaymentItem
                        key={payment.id}
                        payment={payment}
                        onEdit={() => onViewChange('edit-payment', payment)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Bill</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{bill.name}"? This will also delete all associated payments. This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger"
              >
                Delete Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentItem = ({ payment, onEdit }) => {
  const { deletePayment } = useBills();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await deletePayment(payment.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete payment:', error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900">${payment.amount.toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              {format(parseISO(payment.payment_date), 'MMMM d, yyyy')}
            </p>
            {payment.notes && (
              <p className="text-sm text-gray-600 mt-1">{payment.notes}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Payment</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this ${payment.amount.toFixed(2)} payment? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger"
              >
                Delete Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const getDaySuffix = (day) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export default BillDetails;