import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { expenseService, groupService } from '@/services';
import { format } from 'date-fns';
import Text from '@/components/atoms/Text';
import Select from '@/components/atoms/Select';
import InfoCard from '@/components/molecules/InfoCard';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import MemberAvatar from '@/components/molecules/MemberAvatar';
import Button from '@/components/atoms/Button';

const ExpenseList = ({ className, ...props }) => {
    const [expenses, setExpenses] = useState([]);
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState('all');

    const loadData = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

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
        return <LoadingState count={5} className={className} {...props} />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={loadData} className={className} {...props} />;
    }

    return (
        <div className={`p-6 ${className}`} {...props}>
            {/* Header with Filter */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Text as="h1" className="text-2xl font-heading font-bold text-surface-900">Expenses</Text>
                    <Text className="text-surface-600">
                        {filteredExpenses.length > 0 ? `${filteredExpenses.length} expenses found` : 'Track all group expenses'}
                    </Text>
                </div>
                <Select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="px-4 py-2 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="all">All Groups</option>
                    {groups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </Select>
            </div>

            {/* Expenses List */}
            {filteredExpenses.length === 0 ? (
                <EmptyState
                    icon="Receipt"
                    title="No Expenses Yet"
                    description="Start by adding your first expense"
                />
            ) : (
                <div className="space-y-4">
                    {filteredExpenses
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map((expense, index) => (
                            <InfoCard key={expense.id} delay={index * 0.05}>
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <Text as="h3" className="font-semibold text-surface-900">{expense.description}</Text>
                                        <div className="flex items-center space-x-4 text-sm text-surface-500 mt-1">
                                            <Text as="span">
                                                <ApperIcon name="Users" size={14} className="inline mr-1" />
                                                {getGroupName(expense.groupId)}
                                            </Text>
                                            <Text as="span">
                                                <ApperIcon name="User" size={14} className="inline mr-1" />
                                                Paid by {getMemberName(expense.groupId, expense.paidBy)}
                                            </Text>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Text as="div" className="text-lg font-semibold text-primary">
                                            {formatAmount(expense.amount, expense.currency)}
                                        </Text>
                                        <Text as="div" className="text-sm text-surface-500">
                                            {expense.participants?.length || 0} participants
                                        </Text>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-surface-100">
                                    <div className="flex items-center space-x-4 text-sm text-surface-500">
                                        <Text as="span">
                                            <ApperIcon name="Calendar" size={14} className="inline mr-1" />
                                            {format(new Date(expense.date), 'MMM dd, yyyy')}
                                        </Text>
                                        <Text as="span">
                                            <ApperIcon name="Tag" size={14} className="inline mr-1" />
                                            {expense.category}
                                        </Text>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                        <Button className="p-2 text-surface-400 hover:text-primary !hover:scale-100 !active:scale-95">
                                            <ApperIcon name="Edit2" size={16} />
                                        </Button>
                                        <Button className="p-2 text-surface-400 hover:text-red-500 !hover:scale-100 !active:scale-95">
                                            <ApperIcon name="Trash2" size={16} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Participants Preview */}
                                {expense.participants && expense.participants.length > 0 && (
                                    <div className="mt-3 pt-3 border-t border-surface-100">
                                        <div className="flex items-center justify-between text-sm">
                                            <Text as="span" className="text-surface-600 font-medium">Split between:</Text>
                                            <div className="flex -space-x-1">
                                                {expense.participants.slice(0, 3).map((participant, i) => (
                                                    <MemberAvatar
                                                        key={i}
                                                        name={getMemberName(expense.groupId, participant.memberId)}
                                                        size="sm"
                                                        className="border border-white"
                                                        title={getMemberName(expense.groupId, participant.memberId)}
                                                        style={{ zIndex: 3 - i }}
                                                    />
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
                            </InfoCard>
                        ))}
                </div>
            )}
        </div>
    );
};

export default ExpenseList;