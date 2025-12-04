import React, { useState, useEffect } from 'react';
import { useBills } from '../context/BillContext';
import { format } from 'date-fns';

const BillForm = ({ bill, onClose, onSave }) => {
  const { createBill, updateBill, tags, createTag, loadTags } = useBills();
  const [formData, setFormData] = useState({
    name: '',
    payment_url: '',
    notes: '',
    due_day: '',
    recurrence_type: '',
    tags: []
  });
  const [newTagName, setNewTagName] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadTags();
    if (bill) {
      setFormData({
        name: bill.name || '',
        payment_url: bill.payment_url || '',
        notes: bill.notes || '',
        due_day: bill.due_day || '',
        recurrence_type: bill.recurrence_type || '',
        tags: bill.tags ? bill.tags.map(t => t.id) : []
      });
    }
  }, [bill, loadTags]);

  const calculateNextDueDate = (dueDay, recurrenceType) => {
    if (!dueDay || !recurrenceType) return null;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    let nextDue = new Date(currentYear, currentMonth, parseInt(dueDay));
    
    // If the due date has passed this month, move to next period
    if (nextDue <= today) {
      switch (recurrenceType) {
        case 'monthly':
          nextDue = new Date(currentYear, currentMonth + 1, parseInt(dueDay));
          break;
        case 'quarterly':
          nextDue = new Date(currentYear, currentMonth + 3, parseInt(dueDay));
          break;
        case 'yearly':
          nextDue = new Date(currentYear + 1, currentMonth, parseInt(dueDay));
          break;
        default:
          return null;
      }
    }
    
    return format(nextDue, 'yyyy-MM-dd');
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Bill name is required';
    }
    
    if (formData.due_day && (formData.due_day < 1 || formData.due_day > 31)) {
      newErrors.due_day = 'Due day must be between 1 and 31';
    }
    
    if (formData.due_day && !formData.recurrence_type) {
      newErrors.recurrence_type = 'Recurrence type is required when due day is set';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const billData = {
        ...formData,
        next_due_date: calculateNextDueDate(formData.due_day, formData.recurrence_type)
      };
      
      if (bill) {
        await updateBill(bill.id, billData);
      } else {
        await createBill(billData);
      }
      
      onSave();
    } catch (error) {
      console.error('Error saving bill:', error);
      setErrors({ 
        submit: error.message || 'Failed to save bill. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      const tag = await createTag({ name: newTagName.trim() });
      if (tag && tag.id) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag.id]
        }));
        setNewTagName('');
        setShowNewTagInput(false);
        // Reload tags to update the list
        await loadTags();
      } else {
        console.error('Failed to create tag: No tag returned or missing ID');
        // Show user-friendly error
        setErrors(prev => ({ ...prev, tag: 'Failed to create tag. Please try again.' }));
      }
    } catch (error) {
      console.error('Failed to create tag:', error);
      setErrors(prev => ({ ...prev, tag: 'Failed to create tag. Please try again.' }));
    }
  };

  const handleTagToggle = (tagId) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {bill ? 'Edit Bill' : 'Add New Bill'}
              </h1>
              <p className="text-gray-600 mt-1">
                {bill ? 'Update your bill information' : 'Create a new bill to track'}
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

          {/* Form */}
          <form id="bill-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="label">
                    Bill Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="e.g., Electric Bill, Netflix, Mortgage"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="label">
                    Payment URL
                  </label>
                  <input
                    type="url"
                    value={formData.payment_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, payment_url: e.target.value }))}
                    className="input-field"
                    placeholder="https://example.com/pay"
                  />
                  <p className="text-gray-500 text-sm mt-1">Optional link to payment page</p>
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
                    placeholder="Additional notes about this bill..."
                  />
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recurrence Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">
                    Due Day of Month
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.due_day}
                    onChange={(e) => setFormData(prev => ({ ...prev, due_day: e.target.value }))}
                    className={`input-field ${errors.due_day ? 'border-red-500' : ''}`}
                    placeholder="e.g., 15 for 15th of each month"
                  />
                  {errors.due_day && <p className="text-red-500 text-sm mt-1">{errors.due_day}</p>}
                </div>

                <div>
                  <label className="label">
                    Recurrence Type
                  </label>
                  <select
                    value={formData.recurrence_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, recurrence_type: e.target.value }))}
                    className={`input-field ${errors.recurrence_type ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select frequency</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                  {errors.recurrence_type && <p className="text-red-500 text-sm mt-1">{errors.recurrence_type}</p>}
                </div>
              </div>

              {formData.due_day && formData.recurrence_type && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Next due date:</strong> {calculateNextDueDate(formData.due_day, formData.recurrence_type)}
                  </p>
                </div>
              )}
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map(tag => (
                  <label 
                    key={tag.id}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="sr-only"
                    />
                    <span className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.tags.includes(tag.id)
                        ? 'bg-primary-100 text-primary-700 border-2 border-primary-300'
                        : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:border-gray-300'
                    }`}>
                      {tag.name}
                    </span>
                  </label>
                ))}
              </div>

              {showNewTagInput ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="input-field flex-1"
                    placeholder="Enter tag name"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="btn-primary"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewTagInput(false);
                      setNewTagName('');
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewTagInput(true)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  + Add New Tag
                </button>
              )}
              
              {errors.tag && (
                <p className="text-red-500 text-sm mt-2">{errors.tag}</p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{errors.submit}</p>
              </div>
            )}

          </form>
        </div>
      </div>
      </div>
      
      {/* Fixed bottom buttons */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-2xl mx-auto flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="bill-form"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : (bill ? 'Update Bill' : 'Create Bill')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillForm;