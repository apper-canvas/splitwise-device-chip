import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';
import { balanceService, groupService } from '../services';

const BalanceCalculator = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [balances, setBalances] = useState([]);
  const [simplifiedBalances, setSimplifiedBalances] = useState([]);
  const [loading, setLoading] = useState(false);

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
      console.error('Failed to load groups:', error);
    }
  };

  const calculateBalances = async () => {
    if (!selectedGroupId) return;

    setLoading(true);
    try {
      const result = await balanceService.calculateBalances(selectedGroupId);
      setBalances(result.balances || []);
      setSimplifiedBalances(result.simplified || []);
    } catch (error) {
      console.error('Failed to calculate balances:', error);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <ApperIcon name="Calculator" className="text-primary" size={24} />
        <h2 className="text-xl font-heading font-semibold text-surface-900">Balance Calculator</h2>
      </div>

      {/* Group Selector */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">
          Select Group
        </label>
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="bg-surface-100 rounded-lg p-4 animate-pulse"
            >
              <div className="h-4 bg-surface-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-surface-200 rounded w-1/2"></div>
            </motion.div>
          ))}
        </div>
      ) : (
        <>
          {/* Individual Balances */}
          {balances.length > 0 && (
            <div>
              <h3 className="text-lg font-heading font-semibold text-surface-900 mb-4">Individual Balances</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedGroup?.members.map(member => {
                  const memberBalances = balances.filter(b => b.fromMember === member.id || b.toMember === member.id);
                  const totalBalance = memberBalances.reduce((sum, balance) => {
                    if (balance.fromMember === member.id) return sum - balance.amount;
                    if (balance.toMember === member.id) return sum + balance.amount;
                    return sum;
                  }, 0);

                  return (
                    <motion.div
                      key={member.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-white border border-surface-200 rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-medium">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium text-surface-900">{member.name}</h4>
                            <p className="text-sm text-surface-500">{member.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`flex items-center space-x-1 ${getBalanceColor(totalBalance)}`}>
                            <ApperIcon name={getBalanceIcon(totalBalance)} size={16} />
                            <span className="font-semibold">
                              {formatAmount(totalBalance, selectedGroup?.currency)}
                            </span>
                          </div>
                          <p className="text-xs text-surface-500 mt-1">
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
          {simplifiedBalances.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-heading font-semibold text-surface-900">Suggested Settlements</h3>
                <div className="flex items-center space-x-2 text-sm text-surface-600">
                  <ApperIcon name="Zap" size={16} />
                  <span>Simplified to {simplifiedBalances.length} transactions</span>
                </div>
              </div>
              
              <div className="space-y-3">
                {simplifiedBalances.map((settlement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {getMemberName(settlement.fromMember).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-surface-900">
                            {getMemberName(settlement.fromMember)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="ArrowRight" size={16} className="text-surface-400" />
                          <span className="text-sm text-surface-600">pays</span>
                          <ApperIcon name="ArrowRight" size={16} className="text-surface-400" />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {getMemberName(settlement.toMember).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-surface-900">
                            {getMemberName(settlement.toMember)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-lg font-semibold text-accent">
                          {formatAmount(settlement.amount, settlement.currency)}
                        </div>
                        <button className="text-xs text-primary hover:text-secondary font-medium">
                          Mark as Paid
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {balances.length === 0 && !loading && (
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
              <h3 className="mt-4 text-lg font-medium text-surface-900">All Balanced!</h3>
              <p className="mt-2 text-surface-500">No outstanding balances in this group</p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default BalanceCalculator;