import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ExpenseCreationForm from '@/components/organisms/ExpenseCreationForm';
import BalanceOverview from '@/components/organisms/BalanceOverview';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const features = [
    {
        id: 'expenses',
        title: 'Add Expense',
        icon: 'Plus',
        description: 'Track group spending with smart splitting'
    },
    {
        id: 'balance',
        title: 'Balance Calculator',
        icon: 'Calculator',
        description: 'See who owes what with debt simplification'
    }
];

const HomeFeatureSection = ({ className, ...props }) => {
    const [activeFeature, setActiveFeature] = useState('expenses');

    return (
        <div className={`max-w-4xl mx-auto p-6 ${className}`} {...props}>
            {/* Feature Selector */}
            <div className="flex space-x-4 mb-8">
                {features.map((feature) => (
                    <Button
                        key={feature.id}
                        onClick={() => setActiveFeature(feature.id)}
                        className={`flex-1 p-4 rounded-xl border-2 text-left !hover:scale-100 !active:scale-98 ${
                            activeFeature === feature.id
                                ? 'border-primary bg-primary text-white'
                                : 'border-surface-200 bg-white hover:border-primary hover:bg-surface-50'
                        }`}
                    >
                        <div className="flex items-center space-x-3 mb-2">
                            <ApperIcon name={feature.icon} size={24} />
                            <Text as="h3" className="font-heading font-semibold text-lg">{feature.title}</Text>
                        </div>
                        <Text as="p" className={`text-sm ${
                            activeFeature === feature.id ? 'text-purple-100' : 'text-surface-600'
                        }`}>
                            {feature.description}
                        </Text>
                    </Button>
                ))}
            </div>

            {/* Feature Content */}
            <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl border border-surface-200 p-6"
            >
                {activeFeature === 'expenses' && <ExpenseCreationForm />}
                {activeFeature === 'balance' && <BalanceOverview />}
            </motion.div>
        </div>
    );
};

export default HomeFeatureSection;