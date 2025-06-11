import React, { useState } from 'react';
import GroupList from '@/components/organisms/GroupList';
import GroupCreationModal from '@/components/organisms/GroupCreationModal';
import { toast } from 'react-toastify';
import { groupService } from '@/services'; // Ensure groupService is imported for handleCreateGroup

const GroupsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateGroup = async (groupData) => {
    try {
      // In a real app, you'd call groupService.create here
      await groupService.create(groupData); // Assuming groupService.create handles internal state/mock data
      setShowCreateModal(false);
      toast.success('Group created successfully!');
      // Re-load groups in GroupList via its internal loadGroups for freshest data
      // For this example, GroupList manages its own data fetch, so we just close modal and show toast.
      // In a more complex app, you might lift state or use a context/global store.
    } catch (error) {
      toast.error('Failed to create group');
      console.error('Group creation error:', error);
    }
  };

  return (
    <>
      <GroupList onOpenCreateModal={() => setShowCreateModal(true)} />
      <GroupCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateGroup}
      />
    </>
  );
};

export default GroupsPage;