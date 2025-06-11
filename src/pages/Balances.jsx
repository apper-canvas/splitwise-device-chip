import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { balanceService, groupService } from '../services';

const Balances = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [balances, setBalances] = useState([]);
  const [simplifiedBalances, setSimplifiedBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      calculateBalances();
    }
  }, [selectedGroupId]);

  const loadGroups = async () => {
    try {
      const result = await groupService.getAll();
      setGroups(result);
      if (result.length > 0) {
        setSelectedGroupId(result[0].id);
      }
    } catch (error) {
      toast.error('Failed to load groups');
    }
  };

  const calculateBalances = async () => {
    if (!selectedGroupId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await balanceService.calculateBalances(selectedGroupId);
      setBalances(result.balances || []);
      setSimplifiedBalances(result.simplified || []);
    } catch (err) {
      setError(err.message || 'Failed to calculate balances');
      toast.error('Failed to calculate balances');
    } finally {
      setLoading(false);
    }
  };

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const getMemberName = (memberId) => {
    return selectedGroup?.members.find(m => m.id === memberId)?.name || 'Unknown';
  };

  const formatAmount = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(Math.abs(amount));
  };

  const getBalanceColor = (amount) => {
    if (amount > 0) return 'text-accent';
    if (amount < 0) return 'text-red-500';
    return 'text-surface-500';
  };

  const getBalanceIcon = (amount) => {
    if (amount > 0) return 'TrendingUp';
    if (amount < 0) return 'TrendingDown';
    return 'Minus';
  };

  if (groups.length === 0) {
    return (
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
            <ApperIcon name="Scale" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No Groups Found</h3>
          <p className="mt-2 text-surface-500">Create a group first to view balances</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-surface-900">Balances</h1>
          <p className="text-surface-600">See who owes what in your groups</p>
        </div>
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          className="px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {groups.map(group => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
            >
              <div className="h-6 bg-surface-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-surface-200 rounded w-1/2"></div>
            </motion.div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Error Loading Balances</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={calculateBalances}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {/* Individual Balances */}
          {selectedGroup && (
            <div className="mb-8">
              <h2 className="text-lg font-heading font-semibold text-surface-900 mb-4">Individual Balances</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedGroup.members.map((member, index) => {
                  const memberBalances = balances.filter(b => b.fromMember === member.id || b.toMember === member.id);
                  const totalBalance = memberBalances.reduce((sum, balance) => {
                    if (balance.fromMember === member.id) return sum - balance.amount;
                    if (balance.toMember === member.id) return sum + balance.amount;
                    return sum;
                  }, 0);

                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white rounded-xl border border-surface-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-surface-900">{member.name}</h4>
                            <p className="text-sm text-surface-500">{member.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center space-x-2 ${getBalanceColor(totalBalance)}`}>
                            <ApperIcon name={getBalanceIcon(totalBalance)} size={20} />
                            <span className="text-xl font-semibold">
                              {formatAmount(totalBalance, selectedGroup.currency)}
                            </span>
                          </div>
                          <p className="text-sm text-surface-500 mt-1">
                            {totalBalance > 0 ? 'owed to you' : totalBalance < 0 ? 'you owe' : 'settled up'}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Simplified Settlements */}
          {simplifiedBalances.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading font-semibold text-surface-900">Suggested Settlements</h2>
                <div className="flex items-center space-x-2 text-sm text-surface-600 bg-surface-50 px-3 py-2 rounded-lg">
                  <ApperIcon name="Zap" size={16} />
                  <span>Simplified to {simplifiedBalances.length} transactions</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {simplifiedBalances.map((settlement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        {/* From Member */}
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-medium">
                            {getMemberName(settlement.fromMember).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-surface-900">
                              {getMemberName(settlement.fromMember)}
                            </p>
                            <p className="text-sm text-surface-500">owes</p>
                          </div>
                        </div>
                        
                        {/* Arrow */}
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="ArrowRight" size={24} className="text-surface-400" />
                        </div>
                        
                        {/* To Member */}
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-medium">
                            {getMemberName(settlement.toMember).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-surface-900">
                              {getMemberName(settlement.toMember)}
                            </p>
                            <p className="text-sm text-surface-500">receives</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Amount and Action */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent mb-2">
                          {formatAmount(settlement.amount, settlement.currency)}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                        >
                          Mark as Paid
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : !loading && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="CheckCircle" className="w-16 h-16 text-accent mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-surface-900">All Settled Up!</h3>
              <p className="mt-2 text-surface-500">No outstanding balances in this group</p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Balances;