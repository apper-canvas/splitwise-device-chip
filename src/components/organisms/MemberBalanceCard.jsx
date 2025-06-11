import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import InfoCard from '@/components/molecules/InfoCard';
import MemberAvatar from '@/components/molecules/MemberAvatar';
import Text from '@/components/atoms/Text';

const MemberBalanceCard = ({ member, balances, groupCurrency = 'USD', delay = 0, className, ...props }) => {
    const getBalanceColor = (amount) => {
        if (amount > 0) return 'text-accent';
        if (amount < 0) return 'text-red-500';
        return 'text-surface-500';
    };

    const getBalanceIcon = (amount) => {
        if (amount > 0) return 'TrendingUp';
        if (amount < 0) return 'TrendingDown';
        return 'Minus';
    };

    const formatAmount = (amount, currency) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(Math.abs(amount));
    };

    const totalBalance = balances.reduce((sum, balance) => {
        if (balance.fromMember === member.id) return sum - balance.amount;
        if (balance.toMember === member.id) return sum + balance.amount;
        return sum;
    }, 0);

    return (
        <InfoCard delay={delay} whileHover={{ scale: 1.02 }} className={className} {...props}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <MemberAvatar name={member.name} size="xl" />
                    <div>
                        <Text as="h4" className="font-semibold text-surface-900">{member.name}</Text>
                        <Text as="p" className="text-sm text-surface-500">{member.email}</Text>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`flex items-center space-x-2 ${getBalanceColor(totalBalance)}`}>
                        <ApperIcon name={getBalanceIcon(totalBalance)} size={20} />
                        <Text as="span" className="text-xl font-semibold">
                            {formatAmount(totalBalance, groupCurrency)}
                        </Text>
                    </div>
                    <Text as="p" className="text-sm text-surface-500 mt-1">
                        {totalBalance > 0 ? 'owed to you' : totalBalance < 0 ? 'you owe' : 'settled up'}
                    </Text>
                </div>
            </div>
        </InfoCard>
    );
};

export default MemberBalanceCard;