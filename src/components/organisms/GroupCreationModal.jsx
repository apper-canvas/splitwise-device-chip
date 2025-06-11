import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import MemberAvatar from '@/components/molecules/MemberAvatar';
import Select from '@/components/atoms/Select';
import memberService from '@/services/api/memberService';

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];
const GroupCreationModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        currency: 'USD',
        members: []
    });
    const [existingMembers, setExistingMembers] = useState([]);
    const [selectedExistingMembers, setSelectedExistingMembers] = useState([]);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [newMemberPhone, setNewMemberPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [memberSearchQuery, setMemberSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    // Load existing members when modal opens
    useEffect(() => {
        if (isOpen) {
            loadExistingMembers();
        }
    }, [isOpen]);

    const loadExistingMembers = async () => {
        try {
            setLoading(true);
            const members = await memberService.getAll();
            setExistingMembers(members);
        } catch (error) {
            console.error('Failed to load existing members:', error);
        } finally {
            setLoading(false);
        }
    };
const filteredExistingMembers = existingMembers.filter(member =>
        !selectedExistingMembers.some(selected => selected.id === member.id) &&
        (memberSearchQuery === '' || 
         member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
         member.email.toLowerCase().includes(memberSearchQuery.toLowerCase()))
    );

    const handleSelectExistingMember = (member) => {
        setSelectedExistingMembers(prev => [...prev, member]);
        setMemberSearchQuery('');
    };

    const handleRemoveExistingMember = (memberId) => {
        setSelectedExistingMembers(prev => prev.filter(m => m.id !== memberId));
    };
const handlePhoneChange = (e) => {
        const formatted = memberService.formatPhone(e.target.value);
        setNewMemberPhone(formatted);
        
        // Clear error when user starts typing
        if (phoneError) {
            setPhoneError('');
        }
    };
const handleAddMember = (e) => {
        e.preventDefault();
        if (!newMemberName.trim() || !newMemberEmail.trim() || !newMemberPhone.trim()) return;

        // Validate phone number
        if (!memberService.validatePhone(newMemberPhone)) {
            setPhoneError('Please enter a valid phone number in format (123) 456-7890');
            return;
        }
const newMember = {
            id: Date.now().toString(),
            name: newMemberName.trim(),
            email: newMemberEmail.trim(),
            phone: newMemberPhone.trim(),
            avatar: null,
            isNew: true
        };

        setFormData(prev => ({
            ...prev,
            members: [...prev.members, newMember]
        }));
        setNewMemberName('');
        setNewMemberEmail('');
        setNewMemberPhone('');
        setPhoneError('');
    };

    const handleRemoveMember = (memberId) => {
        setFormData(prev => ({
            ...prev,
            members: prev.members.filter(m => m.id !== memberId)
        }));
    };

const handleSubmit = (e) => {
        e.preventDefault();
        const totalMembers = selectedExistingMembers.length + formData.members.length;
        if (!formData.name.trim() || totalMembers === 0) return;
const allMembers = [
            ...selectedExistingMembers.map(member => ({ ...member, isNew: false })),
            ...formData.members
        ];

        onSubmit({
            ...formData,
            members: allMembers,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        });

        // Reset form
        setFormData({
            name: '',
            currency: 'USD',
            members: []
        });
        setSelectedExistingMembers([]);
        setNewMemberName('');
        setNewMemberEmail('');
        setNewMemberPhone('');
        setPhoneError('');
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
                                    <Text as="h2" className="text-xl font-heading font-semibold text-surface-900">Create New Group</Text>
                                    <Button
                                        onClick={onClose}
                                        className="p-2 text-surface-400 hover:text-surface-600 rounded-lg hover:bg-surface-100 !hover:scale-100 !active:scale-95"
                                    >
                                        <ApperIcon name="X" size={20} />
                                    </Button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Group Details */}
                                    <div className="space-y-4">
                                        <FormField label="Group Name" required>
                                            <Input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Trip to Paris"
                                                required
                                            />
                                        </FormField>

                                        <FormField label="Currency">
                                            <Select
                                                value={formData.currency}
                                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                            >
                                                {currencies.map(currency => (
                                                    <option key={currency} value={currency}>{currency}</option>
                                                ))}
                                            </Select>
                                        </FormField>
                                    </div>

{/* Add Members */}
                                    <div>
                                        <Text as="label" className="block text-sm font-medium text-surface-700 mb-3">
                                            Add Members <span className="text-red-500">*</span>
                                        </Text>

                                        {/* Existing Members Selection */}
                                        {!loading && existingMembers.length > 0 && (
                                            <div className="mb-4">
                                                <Text className="text-sm font-medium text-surface-600 mb-2">
                                                    Select from existing members:
                                                </Text>
                                                <div className="relative mb-3">
                                                    <ApperIcon 
                                                        name="Search" 
                                                        size={16} 
                                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
                                                    />
                                                    <Input
                                                        type="text"
                                                        placeholder="Search existing members..."
                                                        value={memberSearchQuery}
                                                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                                                        className="pl-9 py-2"
                                                    />
                                                </div>
                                                
                                                {memberSearchQuery && filteredExistingMembers.length > 0 && (
                                                    <div className="max-h-32 overflow-y-auto border border-surface-200 rounded-lg mb-3">
                                                        {filteredExistingMembers.slice(0, 5).map(member => (
                                                            <Button
                                                                key={member.id}
                                                                type="button"
                                                                onClick={() => handleSelectExistingMember(member)}
                                                                className="w-full text-left p-3 hover:bg-surface-50 border-b border-surface-100 last:border-b-0 !hover:scale-100"
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <MemberAvatar name={member.name} size="sm" />
                                                                    <div>
                                                                        <Text className="font-medium text-surface-900">{member.name}</Text>
                                                                        <Text className="text-xs text-surface-500">{member.email}</Text>
                                                                    </div>
                                                                </div>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Selected Existing Members */}
                                                {selectedExistingMembers.length > 0 && (
                                                    <div className="space-y-2 mb-4">
                                                        <Text className="text-sm font-medium text-surface-600">
                                                            Selected existing members:
                                                        </Text>
                                                        {selectedExistingMembers.map(member => (
                                                            <div key={member.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                                <div className="flex items-center space-x-3">
                                                                    <MemberAvatar name={member.name} size="md" />
                                                                    <div>
                                                                        <Text className="font-medium text-surface-900">{member.name}</Text>
                                                                        <Text className="text-sm text-surface-500">{member.email}</Text>
                                                                        {member.phone && (
                                                                            <Text className="text-xs text-surface-400">{member.phone}</Text>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                                                        Existing
                                                                    </span>
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() => handleRemoveExistingMember(member.id)}
                                                                        className="p-1 text-surface-400 hover:text-red-500 !hover:scale-100 !active:scale-95"
                                                                    >
                                                                        <ApperIcon name="X" size={14} />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Add New Member Form */}
                                        <div className="mb-4">
                                            <Text className="text-sm font-medium text-surface-600 mb-2">
                                                Or add new members:
                                            </Text>
<div className="space-y-3 mb-4">
                            <div className="flex space-x-2">
                                <Input
                                    type="text"
                                    value={newMemberName}
                                    onChange={(e) => setNewMemberName(e.target.value)}
                                    placeholder="Name"
                                    className="flex-1 px-3 py-2"
                                    required
                                />
                                <Input
                                    type="email"
                                    value={newMemberEmail}
                                    onChange={(e) => setNewMemberEmail(e.target.value)}
                                    placeholder="Email"
                                    className="flex-1 px-3 py-2"
                                    required
                                />
                            </div>
                            <div className="flex space-x-2">
                                <div className="flex-1">
                                    <Input
                                        type="tel"
                                        value={newMemberPhone}
                                        onChange={handlePhoneChange}
                                        placeholder="(123) 456-7890"
                                        className={`px-3 py-2 ${phoneError ? 'border-red-500 focus:ring-red-500' : ''}`}
                                        required
                                        maxLength={14}
                                    />
                                    {phoneError && (
                                        <Text className="text-xs text-red-500 mt-1">{phoneError}</Text>
                                    )}
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleAddMember}
                                    disabled={!newMemberName.trim() || !newMemberEmail.trim() || !newMemberPhone.trim()}
                                    className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed !hover:scale-100 !active:scale-95"
                                >
                                    <ApperIcon name="Plus" size={16} />
                                </Button>
                            </div>
                        </div>

{/* New Members List */}
                                        {formData.members.length > 0 && (
                                            <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
                                                <Text className="text-sm font-medium text-surface-600 mb-2">
                                                    New members to be created:
                                                </Text>
                                                {formData.members.map(member => (
                                                    <div key={member.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <MemberAvatar name={member.name} size="md" />
                                                            <div>
                                                                <Text className="font-medium text-surface-900">{member.name}</Text>
                                                                <Text className="text-sm text-surface-500">{member.email}</Text>
                                                                {member.phone && (
                                                                    <Text className="text-xs text-surface-400">{member.phone}</Text>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                                New
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                onClick={() => handleRemoveMember(member.id)}
                                                                className="p-1 text-surface-400 hover:text-red-500 !hover:scale-100 !active:scale-95"
                                                            >
                                                                <ApperIcon name="Trash2" size={16} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
{selectedExistingMembers.length === 0 && formData.members.length === 0 && (
                                            <Text className="text-sm text-surface-500 text-center py-4 bg-surface-50 rounded-lg">
                                                Select existing members or add new members to create the group
                                            </Text>
                                        )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex space-x-3 pt-4 border-t border-surface-200">
                                        <Button
                                            type="button"
                                            onClick={onClose}
                                            className="flex-1 px-4 py-3 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50"
                                        >
                                            Cancel
                                        </Button>
<Button
                                            type="submit"
                                            disabled={!formData.name.trim() || (selectedExistingMembers.length === 0 && formData.members.length === 0)}
                                            className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Create Group
                                        </Button>
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

export default GroupCreationModal;