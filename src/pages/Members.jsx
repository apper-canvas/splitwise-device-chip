import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import Input from '@/components/atoms/Input';
import MemberAvatar from '@/components/molecules/MemberAvatar';
import AddMemberModal from '@/components/organisms/AddMemberModal';
import memberService from '@/services/api/memberService';

const Members = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMembers, setFilteredMembers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState(null);

    useEffect(() => {
        loadMembers();
    }, []);

    useEffect(() => {
        filterMembers();
    }, [members, searchQuery]);

    const loadMembers = async () => {
        try {
            setLoading(true);
            const data = await memberService.getAll();
            setMembers(data);
            setError(null);
        } catch (err) {
            setError('Failed to load members');
            toast.error('Failed to load members');
        } finally {
            setLoading(false);
        }
    };

    const filterMembers = () => {
        if (!searchQuery.trim()) {
            setFilteredMembers(members);
        } else {
            const filtered = members.filter(member =>
                member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (member.phone && member.phone.includes(searchQuery))
            );
            setFilteredMembers(filtered);
        }
    };

    const handleAddMember = async (memberData) => {
        try {
            const newMember = await memberService.create(memberData);
            setMembers(prev => [newMember, ...prev]);
            setIsAddModalOpen(false);
            toast.success('Member added successfully!');
        } catch (err) {
            toast.error('Failed to add member');
        }
    };

    const handleEditMember = async (memberData) => {
        try {
            const updatedMember = await memberService.update(editingMember.id, memberData);
            setMembers(prev => prev.map(m => m.id === editingMember.id ? updatedMember : m));
            setEditingMember(null);
            toast.success('Member updated successfully!');
        } catch (err) {
            toast.error('Failed to update member');
        }
    };

    const handleDeleteMember = async (memberId) => {
        if (!window.confirm('Are you sure you want to delete this member?')) return;

        try {
            await memberService.delete(memberId);
            setMembers(prev => prev.filter(m => m.id !== memberId));
            toast.success('Member deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete member');
        }
    };

    const openEditModal = (member) => {
        setEditingMember(member);
        setIsAddModalOpen(true);
    };

    const closeModal = () => {
        setIsAddModalOpen(false);
        setEditingMember(null);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <Text className="text-red-500 mb-4">{error}</Text>
                <Button onClick={loadMembers} className="bg-primary text-white">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <Text as="h1" className="text-2xl font-heading font-bold text-surface-900 mb-2">
                        Members
                    </Text>
                    <Text className="text-surface-600">
                        Manage your group members and their contact information
                    </Text>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-4 sm:mt-0 bg-primary text-white font-medium px-4 py-2 hover:bg-secondary"
                >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Add Member
                </Button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <ApperIcon 
                        name="Search" 
                        size={20} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400" 
                    />
                    <Input
                        type="text"
                        placeholder="Search members by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Members List */}
            {filteredMembers.length === 0 ? (
                <div className="text-center py-12">
                    {members.length === 0 ? (
                        <>
                            <ApperIcon name="Users" size={48} className="mx-auto text-surface-300 mb-4" />
                            <Text className="text-surface-500 mb-4">No members yet</Text>
                            <Button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-primary text-white"
                            >
                                Add Your First Member
                            </Button>
                        </>
                    ) : (
                        <>
                            <ApperIcon name="Search" size={48} className="mx-auto text-surface-300 mb-4" />
                            <Text className="text-surface-500">No members match your search</Text>
                        </>
                    )}
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredMembers.map((member) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-lg border border-surface-200 p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <MemberAvatar name={member.name} size="lg" />
                                    <div>
                                        <Text as="h3" className="font-medium text-surface-900">
                                            {member.name}
                                        </Text>
                                        <Text className="text-sm text-surface-600">
                                            {member.email}
                                        </Text>
                                        {member.phone && (
                                            <Text className="text-sm text-surface-500">
                                                {member.phone}
                                            </Text>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        onClick={() => openEditModal(member)}
                                        className="p-2 text-surface-400 hover:text-primary hover:bg-primary/10 rounded-lg"
                                    >
                                        <ApperIcon name="Edit" size={16} />
                                    </Button>
                                    <Button
                                        onClick={() => handleDeleteMember(member.id)}
                                        className="p-2 text-surface-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                    >
                                        <ApperIcon name="Trash2" size={16} />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add/Edit Member Modal */}
            <AddMemberModal
                isOpen={isAddModalOpen}
                onClose={closeModal}
                onSubmit={editingMember ? handleEditMember : handleAddMember}
                initialData={editingMember}
                mode={editingMember ? 'edit' : 'add'}
            />
        </div>
    );
};

export default Members;