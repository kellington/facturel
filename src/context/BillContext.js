import React, { createContext, useContext, useReducer, useEffect } from 'react';

const BillContext = createContext();

const initialState = {
  bills: [],
  payments: [],
  tags: [],
  statistics: {},
  loading: false,
  error: null
};

function billReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_BILLS':
      return { ...state, bills: action.payload, loading: false };
    
    case 'ADD_BILL':
      return { ...state, bills: [...state.bills, action.payload] };
    
    case 'UPDATE_BILL':
      return {
        ...state,
        bills: state.bills.map(bill =>
          bill.id === action.payload.id ? action.payload : bill
        )
      };
    
    case 'DELETE_BILL':
      return {
        ...state,
        bills: state.bills.filter(bill => bill.id !== action.payload)
      };
    
    case 'SET_PAYMENTS':
      return { ...state, payments: action.payload };
    
    case 'ADD_PAYMENT':
      return { ...state, payments: [action.payload, ...state.payments] };
    
    case 'UPDATE_PAYMENT':
      return {
        ...state,
        payments: state.payments.map(payment =>
          payment.id === action.payload.id ? action.payload : payment
        )
      };
    
    case 'DELETE_PAYMENT':
      return {
        ...state,
        payments: state.payments.filter(payment => payment.id !== action.payload)
      };
    
    case 'SET_TAGS':
      return { ...state, tags: action.payload };
    
    case 'ADD_TAG':
      return { ...state, tags: [...state.tags, action.payload] };
    
    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload };
    
    default:
      return state;
  }
}

export function BillProvider({ children }) {
  const [state, dispatch] = useReducer(billReducer, initialState);

  // Check if electronAPI is available
  const isElectron = window.electronAPI !== undefined;

  // Load initial data
  useEffect(() => {
    if (isElectron) {
      loadBills();
      loadTags();
      loadStatistics();
    }
  }, [isElectron]);

  const loadBills = async () => {
    if (!isElectron) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const bills = await window.electronAPI.getBills();
      dispatch({ type: 'SET_BILLS', payload: bills });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createBill = async (billData) => {
    if (!isElectron) {
      console.warn('createBill called in non-Electron environment');
      throw new Error('Database not available - please run in Electron environment');
    }
    
    try {
      const bill = await window.electronAPI.createBill(billData);
      dispatch({ type: 'ADD_BILL', payload: bill });
      loadStatistics();
      return bill;
    } catch (error) {
      console.error('Error creating bill:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateBill = async (id, billData) => {
    if (!isElectron) return;
    
    try {
      const bill = await window.electronAPI.updateBill(id, billData);
      dispatch({ type: 'UPDATE_BILL', payload: bill });
      loadStatistics();
      return bill;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteBill = async (id) => {
    if (!isElectron) return;
    
    try {
      await window.electronAPI.deleteBill(id);
      dispatch({ type: 'DELETE_BILL', payload: id });
      loadStatistics();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const archiveBill = async (id) => {
    if (!isElectron) return;
    
    try {
      await window.electronAPI.archiveBill(id);
      dispatch({ type: 'DELETE_BILL', payload: id });
      loadStatistics();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const loadPayments = async (billId = null) => {
    if (!isElectron) return;
    
    try {
      const payments = await window.electronAPI.getPayments(billId);
      dispatch({ type: 'SET_PAYMENTS', payload: payments });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createPayment = async (paymentData) => {
    if (!isElectron) return;
    
    try {
      const payment = await window.electronAPI.createPayment(paymentData);
      dispatch({ type: 'ADD_PAYMENT', payload: payment });
      loadStatistics();
      return payment;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updatePayment = async (id, paymentData) => {
    if (!isElectron) return;
    
    try {
      const payment = await window.electronAPI.updatePayment(id, paymentData);
      dispatch({ type: 'UPDATE_PAYMENT', payload: payment });
      loadStatistics();
      return payment;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deletePayment = async (id) => {
    if (!isElectron) return;
    
    try {
      await window.electronAPI.deletePayment(id);
      dispatch({ type: 'DELETE_PAYMENT', payload: id });
      loadStatistics();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const loadTags = async () => {
    if (!isElectron) return;
    
    try {
      const tags = await window.electronAPI.getTags();
      dispatch({ type: 'SET_TAGS', payload: tags });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createTag = async (tagData) => {
    if (!isElectron) {
      console.warn('createTag called in non-Electron environment');
      return null;
    }
    
    try {
      const tag = await window.electronAPI.createTag(tagData);
      if (tag) {
        dispatch({ type: 'ADD_TAG', payload: tag });
      }
      return tag;
    } catch (error) {
      console.error('Error creating tag:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const loadStatistics = async () => {
    if (!isElectron) return;
    
    try {
      const stats = await window.electronAPI.getStatistics();
      dispatch({ type: 'SET_STATISTICS', payload: stats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const exportToCSV = async () => {
    if (!isElectron) return;
    
    try {
      const csv = await window.electronAPI.exportCSV();
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facturel-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value = {
    ...state,
    isElectron,
    loadBills,
    createBill,
    updateBill,
    deleteBill,
    archiveBill,
    loadPayments,
    createPayment,
    updatePayment,
    deletePayment,
    loadTags,
    createTag,
    loadStatistics,
    exportToCSV,
    clearError
  };

  return (
    <BillContext.Provider value={value}>
      {children}
    </BillContext.Provider>
  );
}

export function useBills() {
  const context = useContext(BillContext);
  if (!context) {
    throw new Error('useBills must be used within a BillProvider');
  }
  return context;
}