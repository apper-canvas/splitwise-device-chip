import React from 'react';

const MemberAvatar = ({ name, size = 'md', className, ...props }) => {
    const sizeClasses = {
        sm: 'w-6 h-6 text-xs',
        md: 'w-8 h-8 text-sm',
        lg: 'w-10 h-10 text-base',
        xl: 'w-12 h-12 text-lg'
    };

    return (
        <div
            className={`bg-primary text-white rounded-full flex items-center justify-center font-medium ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {name.charAt(0).toUpperCase()}
        </div>
    );
};

export default MemberAvatar;