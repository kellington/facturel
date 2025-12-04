const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Bills
  getBills: () => ipcRenderer.invoke('get-bills'),
  createBill: (bill) => ipcRenderer.invoke('create-bill', bill),
  updateBill: (id, bill) => ipcRenderer.invoke('update-bill', id, bill),
  deleteBill: (id) => ipcRenderer.invoke('delete-bill', id),
  archiveBill: (id) => ipcRenderer.invoke('archive-bill', id),
  
  // Payments
  getPayments: (billId) => ipcRenderer.invoke('get-payments', billId),
  createPayment: (payment) => ipcRenderer.invoke('create-payment', payment),
  updatePayment: (id, payment) => ipcRenderer.invoke('update-payment', id, payment),
  deletePayment: (id) => ipcRenderer.invoke('delete-payment', id),
  
  // Tags
  getTags: () => ipcRenderer.invoke('get-tags'),
  createTag: (tag) => ipcRenderer.invoke('create-tag', tag),
  
  // Statistics
  getStatistics: () => ipcRenderer.invoke('get-statistics'),
  
  // Export
  exportCSV: () => ipcRenderer.invoke('export-csv')
});