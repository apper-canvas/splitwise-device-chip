import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }
];

const CurrencySettingsSection = ({ defaultCurrency, onCurrencyChange, className, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl border border-surface-200 p-6 ${className}`}
            {...props}
        >
            <div className="flex items-center space-x-3 mb-4">
                <ApperIcon name="DollarSign" className="text-primary" size={24} />
                <Text as="h2" className="text-lg font-heading font-semibold text-surface-900">
                    Currency
                </Text>
            </div>
            
            <div>
                <Text as="label" className="block text-sm font-medium text-surface-700 mb-3">
                    Default Currency
                </Text>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {currencies.map(currency => (
                        <Button
                            key={currency.code}
                            onClick={() => onCurrencyChange(currency.code)}
                            className={`p-3 rounded-lg border-2 text-left ${
                                defaultCurrency === currency.code
                                    ? 'border-primary bg-primary text-white'
                                    : 'border-surface-200 hover:border-primary hover:bg-surface-50'
                            }`}
                        >
                            <Text as="div" className="font-medium">{currency.symbol} {currency.code}</Text>
                            <Text as="div" className={`text-sm ${
                                defaultCurrency === currency.code ? 'text-purple-100' : 'text-surface-500'
                            }`}>
                                {currency.name}
                            </Text>
                        </Button>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default CurrencySettingsSection;