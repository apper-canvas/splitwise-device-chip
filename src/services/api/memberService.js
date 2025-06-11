import { delay } from '../index';
import membersData from '../mockData/members.json';

class MemberService {
  constructor() {
    this.members = [...membersData];
  }

  async getAll() {
    await delay(300);
    return [...this.members];
  }

  async getById(id) {
    await delay(200);
    const member = this.members.find(m => m.id === id);
    if (!member) {
      throw new Error('Member not found');
    }
    return { ...member };
  }

  async create(memberData) {
    await delay(400);
    const newMember = {
      ...memberData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.members.unshift(newMember);
    return { ...newMember };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.members.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Member not found');
    }
    this.members[index] = { ...this.members[index], ...updateData };
    return { ...this.members[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.members.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Member not found');
    }
    this.members.splice(index, 1);
    return { success: true };
  }

  async search(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return this.members.filter(member => 
      member.name.toLowerCase().includes(lowercaseQuery) ||
      member.email.toLowerCase().includes(lowercaseQuery) ||
      (member.phone && member.phone.includes(query))
    );
  }

  // Validate phone number format
  validatePhone(phone) {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  // Format phone number
  formatPhone(value) {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length >= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
      return digits;
    }
  }
}

export default new MemberService();