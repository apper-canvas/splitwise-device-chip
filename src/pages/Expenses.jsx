import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { expenseService, groupService } from '../services';
import { format } from 'date-fns';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [expensesResult, groupsResult] = await Promise.all([
        expenseService.getAll(),
        groupService.getAll()
      ]);
      setExpenses(expensesResult);
      setGroups(groupsResult);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const getMemberName = (groupId, memberId) => {
    const group = groups.find(g => g.id === groupId);
    return group?.members.find(m => m.id === memberId)?.name || 'Unknown';
  };

  const getGroupName = (groupId) => {
    return groups.find(g => g.id === groupId)?.name || 'Unknown Group';
  };

  const filteredExpenses = selectedGroup === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.groupId === selectedGroup);

  const formatAmount = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm animate-pulse"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-5 bg-surface-200 rounded w-1/3"></div>
              <div className="h-6 bg-surface-200 rounded w-20"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-surface-200 rounded w-1/4"></div>
              <div className="h-4 bg-surface-200 rounded w-1/6"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Expenses</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="p-6">
        {/* Header with Filter */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900">Expenses</h1>
            <p className="text-surface-600">Track all group expenses</p>
          </div>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Groups</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Receipt" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No Expenses Yet</h3>
          <p className="mt-2 text-surface-500">Start by adding your first expense</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header with Filter */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-surface-900">Expenses</h1>
          <p className="text-surface-600">{filteredExpenses.length} expenses found</p>
        </div>
        <select
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Groups</option>
          {groups.map(group => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {filteredExpenses
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg border border-surface-200 p-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-surface-900">{expense.description}</h3>
                  <div className="flex items-center space-x-4 text-sm text-surface-500 mt-1">
                    <span>
                      <ApperIcon name="Users" size={14} className="inline mr-1" />
                      {getGroupName(expense.groupId)}
                    </span>
                    <span>
                      <ApperIcon name="User" size={14} className="inline mr-1" />
                      Paid by {getMemberName(expense.groupId, expense.paidBy)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary">
                    {formatAmount(expense.amount, expense.currency)}
                  </div>
                  <div className="text-sm text-surface-500">
                    {expense.participants?.length || 0} participants
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                <div className="flex items-center space-x-4 text-sm text-surface-500">
                  <span>
                    <ApperIcon name="Calendar" size={14} className="inline mr-1" />
                    {format(new Date(expense.date), 'MMM dd, yyyy')}
                  </span>
                  <span>
                    <ApperIcon name="Tag" size={14} className="inline mr-1" />
                    {expense.category}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-surface-400 hover:text-primary transition-colors">
                    <ApperIcon name="Edit2" size={16} />
                  </button>
                  <button className="p-2 text-surface-400 hover:text-red-500 transition-colors">
                    <ApperIcon name="Trash2" size={16} />
                  </button>
                </div>
              </div>

              {/* Participants Preview */}
              {expense.participants && expense.participants.length > 0 && (
                <div className="mt-3 pt-3 border-t border-surface-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-600 font-medium">Split between:</span>
                    <div className="flex -space-x-1">
                      {expense.participants.slice(0, 3).map((participant, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-xs font-medium border border-white"
                          title={getMemberName(expense.groupId, participant.memberId)}
                        >
                          {getMemberName(expense.groupId, participant.memberId).charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {expense.participants.length > 3 && (
                        <div className="w-6 h-6 bg-surface-300 text-surface-600 rounded-full flex items-center justify-center text-xs font-medium border border-white">
                          +{expense.participants.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default Expenses;