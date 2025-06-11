import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import MemberAvatar from '@/components/molecules/MemberAvatar';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const SettlementProposalCard = ({ settlement, getMemberName, delay = 0, className, ...props }) => {
    const formatAmount = (amount, currency = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(Math.abs(amount));
    };

    const handleMarkAsPaid = () => {
        alert(`Marking ${getMemberName(settlement.fromMember)} paid to ${getMemberName(settlement.toMember)} ${formatAmount(settlement.amount, settlement.currency)}`);
        // In a real app, this would trigger an API call to update the settlement status
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay }}
            className={`bg-gradient-to-r from-accent/5 to-primary/5 border border-accent/20 rounded-xl p-6 ${className}`}
            {...props}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    {/* From Member */}
                    <div className="flex items-center space-x-3">
                        <MemberAvatar
                            name={getMemberName(settlement.fromMember)}
                            size="xl"
                            className="bg-red-100 text-red-600"
                        />
                        <div>
                            <Text as="p" className="font-semibold text-surface-900">
                                {getMemberName(settlement.fromMember)}
                            </Text>
                            <Text as="p" className="text-sm text-surface-500">owes</Text>
                        </div>
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex items-center space-x-2">
                        <ApperIcon name="ArrowRight" size={24} className="text-surface-400" />
                    </div>
                    
                    {/* To Member */}
                    <div className="flex items-center space-x-3">
                        <MemberAvatar
                            name={getMemberName(settlement.toMember)}
                            size="xl"
                            className="bg-green-100 text-green-600"
                        />
                        <div>
                            <Text as="p" className="font-semibold text-surface-900">
                                {getMemberName(settlement.toMember)}
                            </Text>
                            <Text as="p" className="text-sm text-surface-500">receives</Text>
                        </div>
                    </div>
                </div>
                
                {/* Amount and Action */}
                <div className="text-right">
                    <Text as="div" className="text-2xl font-bold text-accent mb-2">
                        {formatAmount(settlement.amount, settlement.currency)}
                    </Text>
                    <Button
                        onClick={handleMarkAsPaid}
                        className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-green-600"
                    >
                        Mark as Paid
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};

export default SettlementProposalCard;