import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { expenseService, groupService } from '@/services';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import MemberAvatar from '@/components/molecules/MemberAvatar';
import SplitTypeButton from '@/components/molecules/SplitTypeButton';

const splitTypes = [
    { id: 'equal', label: 'Split Equally', icon: 'Users' },
    { id: 'percentage', label: 'By Percentage', icon: 'Percent' },
    { id: 'exact', label: 'Exact Amounts', icon: 'Calculator' }
];

const ExpenseCreationForm = ({ className, ...props }) => {
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
        if (!formData.description || !formData.amount || !formData.paidBy || formData.groupId === '') {
            toast.error('Please fill in all required fields');
            return;
        }
        if (selectedGroup.members.length === 0) {
            toast.error('The selected group has no members. Please add members to the group or select another group.');
            return;
        }

        setLoading(true);
        try {
            const expenseData = {
                ...formData,
                amount: parseFloat(formData.amount),
                date: new Date().toISOString(),
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
        <div className={`space-y-6 ${className}`} {...props}>
            <div className="flex items-center space-x-3 mb-6">
                <ApperIcon name="Receipt" className="text-primary" size={24} />
                <Text as="h2" className="text-xl font-heading font-semibold text-surface-900">Add New Expense</Text>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Description" required>
                        <Input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Dinner at restaurant"
                            required
                        />
                    </FormField>

                    <FormField label="Amount" required>
                        <div className="flex">
                            <Select
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                className="px-3 py-3 border border-surface-300 rounded-l-lg bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary !rounded-r-none"
                            >
                                {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'].map(currency => (
                                    <option key={currency} value={currency}>{currency}</option>
                                ))}
                            </Select>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                className="flex-1 px-4 py-3 border-t border-r border-b border-surface-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent !rounded-l-none"
                                required
                            />
                        </div>
                    </FormField>
                </div>

                {/* Group and Payer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Group" required>
                        <Select
                            value={formData.groupId}
                            onChange={(e) => handleGroupChange(e.target.value)}
                            required
                        >
                            {groups.length > 0 ? (
                                groups.map(group => (
                                    <option key={group.id} value={group.id}>{group.name}</option>
                                ))
                            ) : (
                                <option value="">No groups available</option>
                            )}
                        </Select>
                    </FormField>

                    <FormField label="Paid By" required>
                        <Select
                            value={formData.paidBy}
                            onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}
                            required
                            disabled={!selectedGroup || selectedGroup.members.length === 0}
                        >
                            {selectedGroup?.members.length > 0 ? (
                                selectedGroup.members.map(member => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
                                ))
                            ) : (
                                <option value="">No members in group</option>
                            )}
                        </Select>
                    </FormField>
                </div>

                {/* Split Type */}
                <FormField label="Split Type">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {splitTypes.map(type => (
                            <SplitTypeButton
                                key={type.id}
                                id={type.id}
                                label={type.label}
                                icon={type.icon}
                                isActive={formData.splitType === type.id}
                                onClick={() => setFormData({ ...formData, splitType: type.id })}
                            />
                        ))}
                    </div>
                </FormField>

                {/* Participants */}
                {selectedGroup && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <Text as="label" className="block text-sm font-medium text-surface-700">
                                Participants
                            </Text>
                            <Button
                                type="button"
                                onClick={calculateSplits}
                                className="text-sm text-primary hover:text-secondary font-medium px-2 py-1"
                            >
                                Auto Calculate
                            </Button>
                        </div>
                        
                        <div className="space-y-3">
                            {selectedGroup.members.map(member => {
                                const participant = formData.participants.find(p => p.memberId === member.id);
                                const isActive = participant && (participant.share > 0 || formData.splitType === 'equal');
                                
                                return (
                                    <div key={member.id} className="flex items-center space-x-4 p-3 bg-surface-50 rounded-lg">
                                        <Button
                                            type="button"
                                            onClick={() => handleParticipantToggle(member.id)}
                                            className={`w-6 h-6 rounded border-2 flex items-center justify-center !p-0 ${
                                                isActive
                                                    ? 'bg-accent border-accent text-white'
                                                    : 'border-surface-300 hover:border-accent'
                                            }`}
                                        >
                                            {isActive && <ApperIcon name="Check" size={16} />}
                                        </Button>
                                        
                                        <div className="flex-1 flex items-center space-x-3">
                                            <MemberAvatar name={member.name} size="md" />
                                            <Text as="span" className="font-medium text-surface-900">{member.name}</Text>
                                        </div>
                                        
                                        {isActive && formData.splitType !== 'equal' && (
                                            <div className="flex items-center space-x-2">
                                                <Input
                                                    type="number"
                                                    step={formData.splitType === 'percentage' ? '1' : '0.01'}
                                                    value={participant.share}
                                                    onChange={(e) => handleParticipantShare(member.id, e.target.value)}
                                                    className="w-20 px-2 py-1 border border-surface-300 rounded text-center !py-1"
                                                    placeholder="0"
                                                />
                                                <Text as="span" className="text-surface-500 text-sm">
                                                    {formData.splitType === 'percentage' ? '%' : formData.currency}
                                                </Text>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {!selectedGroup && (
                     <EmptyState
                        icon="Users"
                        title="No Group Selected"
                        description="Please create or select a group to add expenses."
                        className="py-6"
                    />
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    disabled={loading || !formData.groupId || selectedGroup?.members.length === 0}
                    className="w-full bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <Text as="span">Adding Expense...</Text>
                        </>
                    ) : (
                        <>
                            <ApperIcon name="Plus" size={20} />
                            <Text as="span">Add Expense</Text>
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
};

export default ExpenseCreationForm;