import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { groupService } from '../services';
import CreateGroupModal from '../components/CreateGroupModal';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await groupService.getAll();
      setGroups(result);
    } catch (err) {
      setError(err.message || 'Failed to load groups');
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      const newGroup = await groupService.create(groupData);
      setGroups(prev => [newGroup, ...prev]);
      setShowCreateModal(false);
      toast.success('Group created successfully!');
    } catch (error) {
      toast.error('Failed to create group');
    }
  };

  const getTotalBalance = (group) => {
    // Mock calculation - in real app would calculate from expenses
    const balances = [-50, 25, 30, -5]; // Mock balances
    return balances.reduce((sum, balance) => sum + Math.abs(balance), 0);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm animate-pulse"
          >
            <div className="h-6 bg-surface-200 rounded w-1/3 mb-4"></div>
            <div className="flex space-x-3 mb-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="w-10 h-10 bg-surface-200 rounded-full"></div>
              ))}
            </div>
            <div className="h-4 bg-surface-200 rounded w-1/4"></div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Groups</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadGroups}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <>
        <div className="p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <ApperIcon name="Users" className="w-16 h-16 text-surface-300 mx-auto" />
            </motion.div>
            <h3 className="mt-4 text-lg font-medium text-surface-900">No Groups Yet</h3>
            <p className="mt-2 text-surface-500 mb-6">Create your first group to start splitting expenses</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              Create Group
            </motion.button>
          </motion.div>
        </div>
        <CreateGroupModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateGroup}
        />
      </>
    );
  }

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-surface-900">Your Groups</h1>
            <p className="text-surface-600">Manage your expense sharing groups</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors"
          >
            <ApperIcon name="Plus" size={20} />
            <span>New Group</span>
          </motion.button>
        </div>

        {/* Groups List */}
        <div className="space-y-4">
          {groups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-heading font-semibold text-surface-900">{group.name}</h3>
                  <p className="text-sm text-surface-500">{group.members.length} members</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary">
                    ${getTotalBalance(group).toFixed(2)}
                  </div>
                  <p className="text-xs text-surface-500">total expenses</p>
                </div>
              </div>

              {/* Members */}
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {group.members.slice(0, 4).map((member, memberIndex) => (
                    <div
                      key={member.id}
                      className="w-10 h-10 bg-primary text-white rounded-full border-2 border-white flex items-center justify-center text-sm font-medium"
                      style={{ zIndex: 4 - memberIndex }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {group.members.length > 4 && (
                    <div className="w-10 h-10 bg-surface-300 text-surface-600 rounded-full border-2 border-white flex items-center justify-center text-sm font-medium">
                      +{group.members.length - 4}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-surface-500">
                  <ApperIcon name="Calendar" size={16} />
                  <span className="text-sm">
                    {new Date(group.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateGroup}
      />
    </>
  );
};

export default Groups;