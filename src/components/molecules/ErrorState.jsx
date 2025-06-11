import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const ErrorState = ({ message, onRetry, className, ...props }) => {
    return (
        <div className={`text-center py-12 ${className}`} {...props}>
            <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <Text as="h3" className="text-lg font-medium text-surface-900 mb-2">
                Error Loading Data
            </Text>
            <Text className="text-surface-600 mb-4">
                {message || 'Something went wrong. Please try again.'}
            </Text>
            <Button
                onClick={onRetry}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary"
            >
                Try Again
            </Button>
        </div>
    );
};

export default ErrorState;