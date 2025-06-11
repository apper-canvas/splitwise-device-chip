import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const SplitTypeButton = ({ id, label, icon, isActive, onClick, className, ...props }) => {
    return (
        <motion.button
            key={id}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`p-3 rounded-lg border-2 flex items-center space-x-2 transition-all duration-200 ${
                isActive
                    ? 'border-primary bg-primary text-white'
                    : 'border-surface-200 hover:border-primary hover:bg-surface-50'
            } ${className}`}
            {...props}
        >
            <ApperIcon name={icon} size={20} />
            <Text as="span" className="font-medium">
                {label}
            </Text>
        </motion.button>
    );
};

export default SplitTypeButton;