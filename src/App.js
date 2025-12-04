import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BillForm from './components/BillForm';
import PaymentForm from './components/PaymentForm';
import BillDetails from './components/BillDetails';
import { BillProvider } from './context/BillContext';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedBill, setSelectedBill] = useState(null);
  const [editingBill, setEditingBill] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);

  const handleViewChange = (view, data = null) => {
    setCurrentView(view);
    
    switch (view) {
      case 'bill-details':
        setSelectedBill(data);
        break;
      case 'new-bill':
        setEditingBill(null);
        break;
      case 'edit-bill':
        setEditingBill(data);
        break;
      case 'new-payment':
        setSelectedBill(data);
        setEditingPayment(null);
        break;
      case 'edit-payment':
        setEditingPayment(data);
        break;
      default:
        setSelectedBill(null);
        setEditingBill(null);
        setEditingPayment(null);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={handleViewChange} />;
      case 'new-bill':
      case 'edit-bill':
        return (
          <BillForm
            bill={editingBill}
            onClose={() => handleViewChange('dashboard')}
            onSave={() => handleViewChange('dashboard')}
          />
        );
      case 'bill-details':
        return (
          <BillDetails
            bill={selectedBill}
            onBack={() => handleViewChange('dashboard')}
            onViewChange={handleViewChange}
          />
        );
      case 'new-payment':
      case 'edit-payment':
        return (
          <PaymentForm
            bill={selectedBill}
            payment={editingPayment}
            onClose={() => 
              selectedBill 
                ? handleViewChange('bill-details', selectedBill)
                : handleViewChange('dashboard')
            }
            onSave={() => 
              selectedBill 
                ? handleViewChange('bill-details', selectedBill)
                : handleViewChange('dashboard')
            }
          />
        );
      default:
        return <Dashboard onViewChange={handleViewChange} />;
    }
  };

  return (
    <BillProvider>
      <div className="flex h-screen bg-gray-50">
        <Sidebar 
          currentView={currentView} 
          onViewChange={handleViewChange} 
        />
        <main className="flex-1 overflow-hidden">
          {renderCurrentView()}
        </main>
      </div>
    </BillProvider>
  );
}

export default App;