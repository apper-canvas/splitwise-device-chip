import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { expenseService } from '../services';
import { groupService } from '../services';

const ExpenseForm = () => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    currency: 'USD',
    paidBy: '',
    groupId: '',
    participants: [],
    splitType: 'equal'
  });
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
  const splitTypes = [
    { id: 'equal', label: 'Split Equally', icon: 'Users' },
    { id: 'percentage', label: 'By Percentage', icon: 'Percent' },
    { id: 'exact', label: 'Exact Amounts', icon: 'Calculator' }
  ];

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const result = await groupService.getAll();
      setGroups(result);
      if (result.length > 0) {
        const firstGroup = result[0];
        setFormData(prev => ({ 
          ...prev, 
          groupId: firstGroup.id,
          paidBy: firstGroup.members[0]?.id || ''
        }));
        setSelectedGroup(firstGroup);
        initializeParticipants(firstGroup.members);
      }
    } catch (error) {
      toast.error('Failed to load groups');
    }
  };

  const initializeParticipants = (members) => {
    const participants = members.map(member => ({
      memberId: member.id,
      share: 0,
      shareType: 'equal'
    }));
    setFormData(prev => ({ ...prev, participants }));
  };

  const handleGroupChange = (groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
      setFormData(prev => ({
        ...prev,
        groupId,
        paidBy: group.members[0]?.id || ''
      }));
      initializeParticipants(group.members);
    }
  };

  const calculateSplits = () => {
    if (!selectedGroup || !formData.amount) return;

    const amount = parseFloat(formData.amount);
    const activeParticipants = formData.participants.filter(p => p.share > 0 || formData.splitType === 'equal');

    if (formData.splitType === 'equal') {
      const equalShare = amount / activeParticipants.length;
      setFormData(prev => ({
        ...prev,
        participants: prev.participants.map(p => ({
          ...p,
          share: equalShare,
          shareType: 'equal'
        }))
      }));
    }
  };

  const handleParticipantToggle = (memberId) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map(p =>
        p.memberId === memberId
          ? { ...p, share: p.share > 0 ? 0 : 1 }
          : p
      )
    }));
  };

  const handleParticipantShare = (memberId, share) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.map(p =>
        p.memberId === memberId
          ? { ...p, share: parseFloat(share) || 0 }
          : p
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.paidBy) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(),
        category: 'General'
      };

      await expenseService.create(expenseData);
      toast.success('Expense added successfully!');
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        currency: 'USD',
        paidBy: selectedGroup?.members[0]?.id || '',
        groupId: formData.groupId,
        participants: formData.participants.map(p => ({ ...p, share: 0 })),
        splitType: 'equal'
      });
    } catch (error) {
      toast.error('Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <ApperIcon name="Receipt" className="text-primary" size={24} />
        <h2 className="text-xl font-heading font-semibold text-surface-900">Add New Expense</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Description *
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Dinner at restaurant"
              className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Amount *
            </label>
            <div className="flex">
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="px-3 py-3 border border-surface-300 rounded-l-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="flex-1 px-4 py-3 border-t border-r border-b border-surface-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
          </div>
        </div>

        {/* Group and Payer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Group *
            </label>
            <select
              value={formData.groupId}
              onChange={(e) => handleGroupChange(e.target.value)}
              className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              {groups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Paid By *
            </label>
            <select
              value={formData.paidBy}
              onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
              className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              {selectedGroup?.members.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Split Type */}
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-3">
            Split Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {splitTypes.map(type => (
              <motion.button
                key={type.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFormData({ ...formData, splitType: type.id })}
                className={`p-3 rounded-lg border-2 flex items-center space-x-2 transition-all duration-200 ${
                  formData.splitType === type.id
                    ? 'border-primary bg-primary text-white'
                    : 'border-surface-200 hover:border-primary hover:bg-surface-50'
                }`}
              >
                <ApperIcon name={type.icon} size={20} />
                <span className="font-medium">{type.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Participants */}
        {selectedGroup && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-surface-700">
                Participants
              </label>
              <button
                type="button"
                onClick={calculateSplits}
                className="text-sm text-primary hover:text-secondary font-medium"
              >
                Auto Calculate
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedGroup.members.map(member => {
                const participant = formData.participants.find(p => p.memberId === member.id);
                const isActive = participant && participant.share > 0;
                
                return (
                  <div key={member.id} className="flex items-center space-x-4 p-3 bg-surface-50 rounded-lg">
                    <button
                      type="button"
                      onClick={() => handleParticipantToggle(member.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                        isActive
                          ? 'bg-accent border-accent text-white'
                          : 'border-surface-300 hover:border-accent'
                      }`}
                    >
                      {isActive && <ApperIcon name="Check" size={16} />}
                    </button>
                    
                    <div className="flex-1 flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-surface-900">{member.name}</span>
                    </div>
                    
                    {isActive && formData.splitType !== 'equal' && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          step={formData.splitType === 'percentage' ? '1' : '0.01'}
                          value={participant.share}
                          onChange={(e) => handleParticipantShare(member.id, e.target.value)}
                          className="w-20 px-2 py-1 border border-surface-300 rounded text-center"
                          placeholder="0"
                        />
                        <span className="text-surface-500 text-sm">
                          {formData.splitType === 'percentage' ? '%' : formData.currency}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-secondary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Adding Expense...</span>
            </>
          ) : (
            <>
              <ApperIcon name="Plus" size={20} />
              <span>Add Expense</span>
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default ExpenseForm;