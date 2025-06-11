import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { groupService } from '@/services';
import InfoCard from '@/components/molecules/InfoCard';
import LoadingState from '@/components/molecules/LoadingState';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import MemberAvatar from '@/components/molecules/MemberAvatar';

const GroupList = ({ onOpenCreateModal, className, ...props }) => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadGroups = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        loadGroups();
    }, [loadGroups]);

    // This is a mock calculation as actual balances are complex and handled by balanceService
    const getTotalGroupExpenses = (group) => {
        // In a real app, this would query expenses related to the group
        // For now, let's return a consistent mock value for demonstration
        return (group.members.length * 100).toFixed(2); // Example: $100 per member
    };

    if (loading) {
        return <LoadingState count={3} className={className} {...props} />;
    }

    if (error) {
        return <ErrorState message={error} onRetry={loadGroups} className={className} {...props} />;
    }

    if (groups.length === 0) {
        return (
            <EmptyState
                icon="Users"
                title="No Groups Yet"
                description="Create your first group to start splitting expenses"
                buttonText="Create Group"
                onButtonClick={onOpenCreateModal}
                className={className}
                {...props}
            />
        );
    }

    return (
        <div className={`p-6 ${className}`} {...props}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <Text as="h1" className="text-2xl font-heading font-bold text-surface-900">Your Groups</Text>
                    <Text className="text-surface-600">Manage your expense sharing groups</Text>
                </div>
                <Button
                    onClick={onOpenCreateModal}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-secondary"
                >
                    <ApperIcon name="Plus" size={20} />
                    <Text as="span">New Group</Text>
                </Button>
            </div>

            {/* Groups List */}
            <div className="space-y-4">
                {groups.map((group, index) => (
                    <InfoCard key={group.id} delay={index * 0.1} className="cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <Text as="h3" className="text-lg font-heading font-semibold text-surface-900">{group.name}</Text>
                                <Text className="text-sm text-surface-500">{group.members.length} members</Text>
                            </div>
                            <div className="text-right">
                                <Text as="div" className="text-lg font-semibold text-primary">
                                    {group.currency ? `${group.currency} ` : '$'}{getTotalGroupExpenses(group)}
                                </Text>
                                <Text as="p" className="text-xs text-surface-500">total expenses</Text>
                            </div>
                        </div>

                        {/* Members */}
                        <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                                {group.members.slice(0, 4).map((member, memberIndex) => (
                                    <MemberAvatar
                                        key={member.id}
                                        name={member.name}
                                        size="lg"
                                        className="border-2 border-white"
                                        style={{ zIndex: 4 - memberIndex }}
                                        title={member.name}
                                    />
                                ))}
                                {group.members.length > 4 && (
                                    <div className="w-10 h-10 bg-surface-300 text-surface-600 rounded-full border-2 border-white flex items-center justify-center text-sm font-medium">
                                        +{group.members.length - 4}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center space-x-2 text-surface-500">
                                <ApperIcon name="Calendar" size={16} />
                                <Text as="span" className="text-sm">
                                    {new Date(group.createdAt).toLocaleDateString()}
                                </Text>
                            </div>
                        </div>
                    </InfoCard>
                ))}
            </div>
        </div>
    );
};

export default GroupList;