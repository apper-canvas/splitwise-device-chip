import React from 'react';
import Select from '@/components/atoms/Select';

const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'CAD', symbol: 'C$' },
    { code: 'AUD', symbol: 'A$' },
    { code: 'JPY', symbol: '¥' }
];

const CurrencySelect = ({ value, onChange, className, ...props }) => {
    return (
        <Select
            value={value}
            onChange={onChange}
            className={className}
            {...props}
        >
            {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code}
                </option>
            ))}
        </Select>
    );
};

export default CurrencySelect;