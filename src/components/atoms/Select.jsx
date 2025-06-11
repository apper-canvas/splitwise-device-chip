import React from 'react';

const Select = ({ children, className, value, onChange, required = false, ...props }) => {
    return (
        <select
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
            {...props}
        >
            {children}
        </select>
    );
};

export default Select;