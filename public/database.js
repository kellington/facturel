const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');
const { v4: uuidv4 } = require('uuid');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'facturel.db');
    
    // Ensure the directory exists
    fs.mkdirSync(userDataPath, { recursive: true });
    
    this.db = new Database(dbPath);
    this.createTables();
  }

  createTables() {
    // Bills table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS bills (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        logo_path TEXT,
        payment_url TEXT,
        notes TEXT,
        due_day INTEGER,
        recurrence_type TEXT CHECK(recurrence_type IN ('monthly', 'quarterly', 'yearly')),
        next_due_date TEXT,
        is_archived INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Payments table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS payments (
        id TEXT PRIMARY KEY,
        bill_id TEXT NOT NULL,
        amount REAL NOT NULL,
        payment_date TEXT NOT NULL,
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE CASCADE
      )
    `);

    // Tags table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tags (
        id TEXT PRIMARY KEY,
        name TEXT UNIQUE NOT NULL,
        color TEXT DEFAULT '#3B82F6',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bill-Tag junction table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS bill_tags (
        bill_id TEXT NOT NULL,
        tag_id TEXT NOT NULL,
        PRIMARY KEY (bill_id, tag_id),
        FOREIGN KEY (bill_id) REFERENCES bills (id) ON DELETE CASCADE,
        FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_bills_archived ON bills (is_archived);
      CREATE INDEX IF NOT EXISTS idx_payments_bill_id ON payments (bill_id);
      CREATE INDEX IF NOT EXISTS idx_payments_date ON payments (payment_date);
    `);
  }

  // Bills
  getBills(includeArchived = false) {
    const query = includeArchived 
      ? 'SELECT * FROM bills ORDER BY name'
      : 'SELECT * FROM bills WHERE is_archived = 0 ORDER BY name';
    
    const bills = this.db.prepare(query).all();
    
    // Get tags for each bill
    const getTagsQuery = this.db.prepare(`
      SELECT t.* FROM tags t
      JOIN bill_tags bt ON t.id = bt.tag_id
      WHERE bt.bill_id = ?
    `);
    
    return bills.map(bill => ({
      ...bill,
      tags: getTagsQuery.all(bill.id)
    }));
  }

  createBill(bill) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO bills (id, name, logo_path, payment_url, notes, due_day, recurrence_type, next_due_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      bill.name,
      bill.logo_path || null,
      bill.payment_url || null,
      bill.notes || null,
      bill.due_day || null,
      bill.recurrence_type || null,
      bill.next_due_date || null,
      now,
      now
    );

    // Add tags if provided
    if (bill.tags && bill.tags.length > 0) {
      this.updateBillTags(id, bill.tags);
    }

    return this.getBillById(id);
  }

  updateBill(id, bill) {
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      UPDATE bills 
      SET name = ?, logo_path = ?, payment_url = ?, notes = ?, 
          due_day = ?, recurrence_type = ?, next_due_date = ?, updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(
      bill.name,
      bill.logo_path || null,
      bill.payment_url || null,
      bill.notes || null,
      bill.due_day || null,
      bill.recurrence_type || null,
      bill.next_due_date || null,
      now,
      id
    );

    // Update tags
    if (bill.tags !== undefined) {
      this.updateBillTags(id, bill.tags);
    }

    return this.getBillById(id);
  }

  deleteBill(id) {
    const stmt = this.db.prepare('DELETE FROM bills WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  archiveBill(id) {
    const stmt = this.db.prepare('UPDATE bills SET is_archived = 1, updated_at = ? WHERE id = ?');
    const result = stmt.run(new Date().toISOString(), id);
    return result.changes > 0;
  }

  getBillById(id) {
    const bill = this.db.prepare('SELECT * FROM bills WHERE id = ?').get(id);
    if (!bill) return null;
    
    const tags = this.db.prepare(`
      SELECT t.* FROM tags t
      JOIN bill_tags bt ON t.id = bt.tag_id
      WHERE bt.bill_id = ?
    `).all(id);
    
    return { ...bill, tags };
  }

  // Payments
  getPayments(billId = null) {
    const query = billId 
      ? 'SELECT * FROM payments WHERE bill_id = ? ORDER BY payment_date DESC'
      : 'SELECT * FROM payments ORDER BY payment_date DESC';
    
    return billId 
      ? this.db.prepare(query).all(billId)
      : this.db.prepare(query).all();
  }

  createPayment(payment) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO payments (id, bill_id, amount, payment_date, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      payment.bill_id,
      payment.amount,
      payment.payment_date,
      payment.notes || null,
      now,
      now
    );

    return this.db.prepare('SELECT * FROM payments WHERE id = ?').get(id);
  }

  updatePayment(id, payment) {
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      UPDATE payments 
      SET amount = ?, payment_date = ?, notes = ?, updated_at = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(
      payment.amount,
      payment.payment_date,
      payment.notes || null,
      now,
      id
    );

    return result.changes > 0 ? this.db.prepare('SELECT * FROM payments WHERE id = ?').get(id) : null;
  }

  deletePayment(id) {
    const stmt = this.db.prepare('DELETE FROM payments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Tags
  getTags() {
    return this.db.prepare('SELECT * FROM tags ORDER BY name').all();
  }

  createTag(tag) {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = this.db.prepare(`
      INSERT INTO tags (id, name, color, created_at)
      VALUES (?, ?, ?, ?)
    `);
    
    try {
      stmt.run(id, tag.name, tag.color || '#3B82F6', now);
      return this.db.prepare('SELECT * FROM tags WHERE id = ?').get(id);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        // Tag already exists, return existing tag
        return this.db.prepare('SELECT * FROM tags WHERE name = ?').get(tag.name);
      }
      throw error;
    }
  }

  updateBillTags(billId, tagIds) {
    // Remove existing tags
    this.db.prepare('DELETE FROM bill_tags WHERE bill_id = ?').run(billId);
    
    // Add new tags
    if (tagIds && tagIds.length > 0) {
      const stmt = this.db.prepare('INSERT INTO bill_tags (bill_id, tag_id) VALUES (?, ?)');
      tagIds.forEach(tagId => {
        stmt.run(billId, tagId);
      });
    }
  }

  // Statistics
  getStatistics() {
    const totalBills = this.db.prepare('SELECT COUNT(*) as count FROM bills WHERE is_archived = 0').get().count;
    const totalPayments = this.db.prepare('SELECT COUNT(*) as count FROM payments').get().count;
    
    const paymentStats = this.db.prepare(`
      SELECT 
        AVG(amount) as average,
        MIN(amount) as lowest,
        MAX(amount) as highest,
        SUM(amount) as total
      FROM payments
    `).get();

    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    
    const thisYearTotal = this.db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM payments 
      WHERE payment_date LIKE ?
    `).get(`${currentYear}-%`).total;
    
    const lastYearTotal = this.db.prepare(`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM payments 
      WHERE payment_date LIKE ?
    `).get(`${lastYear}-%`).total;

    return {
      totalBills,
      totalPayments,
      averagePayment: paymentStats.average || 0,
      lowestPayment: paymentStats.lowest || 0,
      highestPayment: paymentStats.highest || 0,
      totalPaid: paymentStats.total || 0,
      thisYearTotal,
      lastYearTotal
    };
  }

  // Export
  exportToCSV() {
    const bills = this.getBills(true);
    const payments = this.getPayments();
    
    let csv = 'Type,Bill Name,Amount,Date,Notes,Tags\n';
    
    bills.forEach(bill => {
      const tags = bill.tags.map(t => t.name).join(';');
      csv += `Bill,"${bill.name}",,"${bill.created_at}","${bill.notes || ''}","${tags}"\n`;
    });
    
    payments.forEach(payment => {
      const bill = bills.find(b => b.id === payment.bill_id);
      const billName = bill ? bill.name : 'Unknown';
      csv += `Payment,"${billName}",${payment.amount},"${payment.payment_date}","${payment.notes || ''}",\n`;
    });
    
    return csv;
  }
}

module.exports = DatabaseManager;