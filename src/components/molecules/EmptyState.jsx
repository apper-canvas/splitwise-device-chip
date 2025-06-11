import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const EmptyState = ({
    icon,
    title,
    description,
    buttonText,
    onButtonClick,
    className,
    ...props
}) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-center py-12 ${className}`}
            {...props}
        >
            <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="mb-4"
            >
                <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto" />
            </motion.div>
            <Text as="h3" className="mt-4 text-lg font-medium text-surface-900">
                {title}
            </Text>
            <Text className="mt-2 text-surface-500 mb-6">
                {description}
            </Text>
            {buttonText && onButtonClick && (
                <Button
                    onClick={onButtonClick}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary"
                >
                    {buttonText}
                </Button>
            )}
        </motion.div>
    );
};

export default EmptyState;