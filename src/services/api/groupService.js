import { delay } from '../index';
import groupsData from '../mockData/groups.json';

class GroupService {
  constructor() {
    this.groups = [...groupsData];
  }

  async getAll() {
    await delay(300);
    return [...this.groups];
  }

  async getById(id) {
    await delay(200);
    const group = this.groups.find(g => g.id === id);
    if (!group) {
      throw new Error('Group not found');
    }
    return { ...group };
  }

  async create(groupData) {
    await delay(400);
    const newGroup = {
      ...groupData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.groups.unshift(newGroup);
    return { ...newGroup };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.groups.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Group not found');
    }
    this.groups[index] = { ...this.groups[index], ...updateData };
    return { ...this.groups[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.groups.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Group not found');
    }
    this.groups.splice(index, 1);
    return { success: true };
  }

  async addMember(groupId, memberData) {
    await delay(300);
    const group = this.groups.find(g => g.id === groupId);
    if (!group) {
      throw new Error('Group not found');
    }
    const newMember = {
      ...memberData,
      id: Date.now().toString()
    };
    group.members.push(newMember);
    return { ...newMember };
  }

  async removeMember(groupId, memberId) {
    await delay(250);
    const group = this.groups.find(g => g.id === groupId);
    if (!group) {
      throw new Error('Group not found');
    }
    group.members = group.members.filter(m => m.id !== memberId);
    return { success: true };
  }
}

export default new GroupService();