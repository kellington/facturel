import React, { useState, useEffect } from 'react';
import { useBills } from '../context/BillContext';
import { format } from 'date-fns';

const PaymentForm = ({ bill, payment, onClose, onSave }) => {
  const { createPayment, updatePayment } = useBills();
  const [formData, setFormData] = useState({
    amount: '',
    payment_date: format(new Date(), 'yyyy-MM-dd'),
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (payment) {
      setFormData({
        amount: payment.amount.toString(),
        payment_date: payment.payment_date.split('T')[0], // Handle ISO date format
        notes: payment.notes || ''
      });
    }
  }, [payment]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.payment_date) {
      newErrors.payment_date = 'Payment date is required';
    }
    
    const paymentDate = new Date(formData.payment_date);
    const today = new Date();
    if (paymentDate > today) {
      newErrors.payment_date = 'Payment date cannot be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const paymentData = {
        ...formData,
        amount: parseFloat(formData.amount),
        bill_id: bill.id
      };
      
      if (payment) {
        await updatePayment(payment.id, paymentData);
      } else {
        await createPayment(paymentData);
      }
      
      onSave();
    } catch (error) {
      setErrors({ submit: 'Failed to save payment. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, amount: value }));
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {payment ? 'Edit Payment' : 'Log Payment'}
              </h1>
              <p className="text-gray-600 mt-1">
                {payment ? 'Update payment details' : `Record a payment for ${bill?.name}`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Bill Info */}
          {bill && (
            <div className="card mb-6">
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
                  <h2 className="text-lg font-semibold text-gray-900">{bill.name}</h2>
                  <p className="text-gray-600">
                    {bill.recurrence_type ? 
                      `${bill.recurrence_type.charAt(0).toUpperCase()}${bill.recurrence_type.slice(1)} bill` : 
                      'One-time bill'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">
                    Amount *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      value={formData.amount}
                      onChange={handleAmountChange}
                      className={`input-field pl-7 ${errors.amount ? 'border-red-500' : ''}`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>

                <div>
                  <label className="label">
                    Payment Date *
                  </label>
                  <input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_date: e.target.value }))}
                    className={`input-field ${errors.payment_date ? 'border-red-500' : ''}`}
                    max={format(new Date(), 'yyyy-MM-dd')}
                  />
                  {errors.payment_date && <p className="text-red-500 text-sm mt-1">{errors.payment_date}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="label">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="input-field"
                    rows={3}
                    placeholder="Additional notes about this payment (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Quick Amount Buttons */}
            <div className="card">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Amounts</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[25, 50, 100, 200].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Preview */}
            {formData.amount && formData.payment_date && (
              <div className="card bg-green-50 border-green-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">
                      ${parseFloat(formData.amount || 0).toFixed(2)} payment
                    </p>
                    <p className="text-sm text-green-700">
                      {bill?.name} on {format(new Date(formData.payment_date), 'MMMM d, yyyy')}
                    </p>
                    {formData.notes && (
                      <p className="text-sm text-green-600 mt-1">{formData.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{errors.submit}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.amount || !formData.payment_date}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (payment ? 'Update Payment' : 'Log Payment')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;