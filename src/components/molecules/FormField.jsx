import React from 'react';
import Text from '@/components/atoms/Text';

const FormField = ({ label, id, children, required = false, className, ...props }) => {
    return (
        <div className={className} {...props}>
            <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
        </div>
    );
};

export default FormField;