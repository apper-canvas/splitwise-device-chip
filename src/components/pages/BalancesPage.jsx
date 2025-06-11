import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { balanceService, groupService } from '@/services';
import Text from '@/components/atoms/Text';
import Select from '@/components/atoms/Select';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import MemberBalanceCard from '@/components/organisms/MemberBalanceCard';
import SettlementProposalCard from '@/components/organisms/SettlementProposalCard';

const BalancesPage = () => {
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [balances, setBalances] = useState([]);
  const [simplifiedBalances, setSimplifiedBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadGroups = useCallback(async () => {
    try {
      const result = await groupService.getAll();
      setGroups(result);
      if (result.length > 0) {
        setSelectedGroupId(result[0].id);
      }
    } catch (error) {
      toast.error('Failed to load groups');
      setError('Failed to load groups for balance calculation.');
    }
  }, []);

  const calculateBalances = useCallback(async () => {
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
  }, [selectedGroupId]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  useEffect(() => {
    if (selectedGroupId) {
      calculateBalances();
    }
  }, [selectedGroupId, calculateBalances]);

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const getMemberName = (memberId) => {
    return selectedGroup?.members.find(m => m.id === memberId)?.name || 'Unknown';
  };

  if (groups.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon="Scale"
          title="No Groups Found"
          description="Create a group first to view balances"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Text as="h1" className="text-2xl font-heading font-bold text-surface-900">Balances</Text>
          <Text className="text-surface-600">See who owes what in your groups</Text>
        </div>
        <Select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
          className="px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {groups.map(group => (
            <option key={group.id} value={group.id}>{group.name}</option>
          ))}
        </Select>
      </div>

      {loading ? (
        <LoadingState count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={calculateBalances} />
      ) : (
        <>
          {/* Individual Balances */}
          {selectedGroup && (
            <div className="mb-8">
              <Text as="h2" className="text-lg font-heading font-semibold text-surface-900 mb-4">Individual Balances</Text>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedGroup.members.map((member, index) => (
                  <MemberBalanceCard
                    key={member.id}
                    member={member}
                    balances={balances}
                    groupCurrency={selectedGroup.currency}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Simplified Settlements */}
          {simplifiedBalances.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <Text as="h2" className="text-lg font-heading font-semibold text-surface-900">Suggested Settlements</Text>
                <div className="flex items-center space-x-2 text-sm text-surface-600 bg-surface-50 px-3 py-2 rounded-lg">
                  <ApperIcon name="Zap" size={16} />
                  <Text as="span">Simplified to {simplifiedBalances.length} transactions</Text>
                </div>
              </div>
              
              <div className="space-y-4">
                {simplifiedBalances.map((settlement, index) => (
                  <SettlementProposalCard
                    key={index}
                    settlement={settlement}
                    getMemberName={getMemberName}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          ) : !loading && (
            <EmptyState
              icon="CheckCircle"
              title="All Settled Up!"
              description="No outstanding balances in this group"
            />
          )}
        </>
      )}
    </div>
  );
};

export default BalancesPage;