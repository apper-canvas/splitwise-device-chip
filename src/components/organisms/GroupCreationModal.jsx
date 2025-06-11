import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import MemberAvatar from '@/components/molecules/MemberAvatar';
import Select from '@/components/atoms/Select';

const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'];

const GroupCreationModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        currency: 'USD',
        members: []
    });
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberEmail, setNewMemberEmail] = useState('');

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
            createdAt: new Date().toISOString()
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
                                        
                                        <div className="flex space-x-2 mb-4">
                                            <Input
                                                type="text"
                                                value={newMemberName}
                                                onChange={(e) => setNewMemberName(e.target.value)}
                                                placeholder="Name"
                                                className="flex-1 px-3 py-2"
                                            />
                                            <Input
                                                type="email"
                                                value={newMemberEmail}
                                                onChange={(e) => setNewMemberEmail(e.target.value)}
                                                placeholder="Email"
                                                className="flex-1 px-3 py-2"
                                            />
                                            <Button
                                                type="button"
                                                onClick={handleAddMember}
                                                className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-secondary !hover:scale-100 !active:scale-95"
                                            >
                                                <ApperIcon name="Plus" size={16} />
                                            </Button>
                                        </div>

                                        {/* Members List */}
                                        {formData.members.length > 0 && (
                                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                                {formData.members.map(member => (
                                                    <div key={member.id} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                                                        <div className="flex items-center space-x-3">
                                                            <MemberAvatar name={member.name} size="md" />
                                                            <div>
                                                                <Text as="p" className="font-medium text-surface-900">{member.name}</Text>
                                                                <Text as="p" className="text-sm text-surface-500">{member.email}</Text>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            onClick={() => handleRemoveMember(member.id)}
                                                            className="p-1 text-surface-400 hover:text-red-500 !hover:scale-100 !active:scale-95"
                                                        >
                                                            <ApperIcon name="Trash2" size={16} />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {formData.members.length === 0 && (
                                            <Text className="text-sm text-surface-500 text-center py-4 bg-surface-50 rounded-lg">
                                                Add at least one member to create the group
                                            </Text>
                                        )}
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
                                            disabled={!formData.name.trim() || formData.members.length === 0}
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