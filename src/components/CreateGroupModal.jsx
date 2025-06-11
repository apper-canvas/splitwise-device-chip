import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from './ApperIcon';

const CreateGroupModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    currency: 'USD',
    members: []
  });
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim()) return;

    const newMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      email: newMemberEmail.trim(),
      avatar: null
    };

    setFormData(prev => ({
      ...prev,
      members: [...prev.members, newMember]
    }));

    setNewMemberName('');
    setNewMemberEmail('');
  };

  const handleRemoveMember = (memberId) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== memberId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.members.length === 0) return;

    onSubmit({
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date()
    });

    // Reset form
    setFormData({
      name: '',
      currency: 'USD',
      members: []
    });
    setNewMemberName('');
    setNewMemberEmail('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-semibold text-surface-900">Create New Group</h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-surface-400 hover:text-surface-600 rounded-lg hover:bg-surface-100 transition-colors"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Group Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Group Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Trip to Paris"
                        className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {currencies.map(currency => (
                          <option key={currency} value={currency}>{currency}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Add Members */}
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-3">
                      Add Members *
                    </label>
                    
                    <div className="flex space-x-2 mb-4">
                      <input
                        type="text"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder="Name"
                        className="flex-1 px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="Email"
                        className="flex-1 px-3 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={handleAddMember}
                        className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                      >
                        <ApperIcon name="Plus" size={16} />
                      </button>
                    </div>

                    {/* Members List */}
                    {formData.members.length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {formData.members.map(member => (
                          <div key={member.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-surface-900">{member.name}</p>
                                <p className="text-sm text-surface-500">{member.email}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.id)}
                              className="p-1 text-surface-400 hover:text-red-500 transition-colors"
                            >
                              <ApperIcon name="Trash2" size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {formData.members.length === 0 && (
                      <p className="text-sm text-surface-500 text-center py-4 bg-surface-50 rounded-lg">
                        Add at least one member to create the group
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-3 pt-4 border-t border-surface-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-3 border border-surface-300 text-surface-700 rounded-lg font-medium hover:bg-surface-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      disabled={!formData.name.trim() || formData.members.length === 0}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Group
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateGroupModal;