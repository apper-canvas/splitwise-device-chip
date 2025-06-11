import React from 'react';

const Input = ({ className, type = 'text', value, onChange, placeholder, required = false, ...props }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
            {...props}
        />
    );
};

export default Input;