import { delay } from '../index';
import expensesData from '../mockData/expenses.json';

class ExpenseService {
  constructor() {
    this.expenses = [...expensesData];
  }

  async getAll() {
    await delay(350);
    return [...this.expenses];
  }

  async getById(id) {
    await delay(200);
    const expense = this.expenses.find(e => e.id === id);
    if (!expense) {
      throw new Error('Expense not found');
    }
    return { ...expense };
  }

  async getByGroup(groupId) {
    await delay(300);
    return this.expenses.filter(e => e.groupId === groupId).map(e => ({ ...e }));
  }

  async create(expenseData) {
    await delay(400);
    const newExpense = {
      ...expenseData,
      id: Date.now().toString(),
      date: expenseData.date || new Date().toISOString()
    };
    this.expenses.unshift(newExpense);
    return { ...newExpense };
  }

  async update(id, updateData) {
    await delay(350);
    const index = this.expenses.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }
    this.expenses[index] = { ...this.expenses[index], ...updateData };
    return { ...this.expenses[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.expenses.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }
    this.expenses.splice(index, 1);
    return { success: true };
  }

  async getExpensesByDateRange(startDate, endDate) {
    await delay(300);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.expenses
      .filter(e => {
        const expenseDate = new Date(e.date);
        return expenseDate >= start && expenseDate <= end;
      })
      .map(e => ({ ...e }));
  }

  async getExpensesByMember(memberId) {
    await delay(250);
    return this.expenses
      .filter(e => 
        e.paidBy === memberId || 
        e.participants?.some(p => p.memberId === memberId)
      )
      .map(e => ({ ...e }));
  }
}

export default new ExpenseService();