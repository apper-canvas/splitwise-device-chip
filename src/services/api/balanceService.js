import { delay } from '../index';
import expenseService from './expenseService';
import groupService from './groupService';

class BalanceService {
  async calculateBalances(groupId) {
    await delay(400);
    
    try {
      const [expenses, group] = await Promise.all([
        expenseService.getByGroup(groupId),
        groupService.getById(groupId)
      ]);

      const balances = this.calculateMemberBalances(expenses, group.members);
      const simplified = this.simplifyBalances(balances);

      return {
        balances,
        simplified,
        groupId
      };
    } catch (error) {
      throw new Error('Failed to calculate balances');
    }
  }

  calculateMemberBalances(expenses, members) {
    const memberBalances = {};
    
    // Initialize balances
    members.forEach(member => {
      memberBalances[member.id] = 0;
    });

    // Calculate balances from expenses
    expenses.forEach(expense => {
      const totalAmount = expense.amount;
      const participants = expense.participants || [];
      
      if (participants.length === 0) return;

      // Add amount to payer
      memberBalances[expense.paidBy] += totalAmount;

      // Calculate shares
      const totalShares = participants.reduce((sum, p) => sum + (p.share || 0), 0);
      
      participants.forEach(participant => {
        const share = participant.share || 0;
        const shareAmount = totalShares > 0 ? (share / totalShares) * totalAmount : totalAmount / participants.length;
        memberBalances[participant.memberId] -= shareAmount;
      });
    });

    // Convert to balance array
    const balances = [];
    Object.entries(memberBalances).forEach(([memberId, balance]) => {
      if (Math.abs(balance) > 0.01) { // Ignore tiny amounts due to rounding
        if (balance > 0) {
          // This member is owed money
          Object.entries(memberBalances).forEach(([otherMemberId, otherBalance]) => {
            if (otherBalance < -0.01 && memberId !== otherMemberId) {
              const transferAmount = Math.min(balance, Math.abs(otherBalance));
              if (transferAmount > 0.01) {
                balances.push({
                  fromMember: otherMemberId,
                  toMember: memberId,
                  amount: transferAmount,
                  currency: 'USD' // Default currency
                });
              }
            }
          });
        }
      }
    });

    return balances;
  }

  simplifyBalances(balances) {
    // Simple debt simplification algorithm
    const memberBalances = {};
    
    // Calculate net balances
    balances.forEach(balance => {
      if (!memberBalances[balance.fromMember]) memberBalances[balance.fromMember] = 0;
      if (!memberBalances[balance.toMember]) memberBalances[balance.toMember] = 0;
      
      memberBalances[balance.fromMember] -= balance.amount;
      memberBalances[balance.toMember] += balance.amount;
    });

    // Create simplified transactions
    const simplified = [];
    const creditors = Object.entries(memberBalances).filter(([_, balance]) => balance > 0.01);
    const debtors = Object.entries(memberBalances).filter(([_, balance]) => balance < -0.01);

    creditors.forEach(([creditorId, creditAmount]) => {
      let remainingCredit = creditAmount;
      
      debtors.forEach(([debtorId, debtAmount]) => {
        if (remainingCredit > 0.01 && debtAmount < -0.01) {
          const transferAmount = Math.min(remainingCredit, Math.abs(debtAmount));
          
          simplified.push({
            fromMember: debtorId,
            toMember: creditorId,
            amount: transferAmount,
            currency: 'USD'
          });

          remainingCredit -= transferAmount;
          memberBalances[debtorId] += transferAmount;
        }
      });
    });

    return simplified;
  }

  async getBalanceHistory(groupId, startDate, endDate) {
    await delay(300);
    // Mock implementation - would track balance changes over time
    return {
      groupId,
      period: { startDate, endDate },
      history: []
    };
  }

  async settleBalance(fromMemberId, toMemberId, amount, groupId) {
    await delay(250);
    // Mock settlement - would integrate with payment systems
    return {
      success: true,
      settlement: {
        id: Date.now().toString(),
        fromMember: fromMemberId,
        toMember: toMemberId,
        amount,
        groupId,
        settledAt: new Date().toISOString()
      }
    };
  }
}

export default new BalanceService();