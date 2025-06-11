import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';

const AccountActionsSection = ({ className, ...props }) => {
    // These actions would typically trigger modals or API calls
    const handleExportData = () => {
        alert('Exporting data...');
    };

    const handleHelpSupport = () => {
        alert('Opening help and support...');
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Account deleted!'); // Mock action
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`bg-white rounded-xl border border-surface-200 p-6 ${className}`}
            {...props}
        >
            <div className="flex items-center space-x-3 mb-4">
                <ApperIcon name="Shield" className="text-primary" size={24} />
                <Text as="h2" className="text-lg font-heading font-semibold text-surface-900">
                    Account
                </Text>
            </div>

            <div className="space-y-3">
                <Button
                    onClick={handleExportData}
                    className="w-full p-3 text-left border border-surface-200 rounded-lg hover:bg-surface-50"
                >
                    <div className="flex items-center space-x-3">
                        <ApperIcon name="Download" size={20} className="text-surface-500" />
                        <div>
                            <Text as="p" className="font-medium text-surface-900">Export Data</Text>
                            <Text as="p" className="text-sm text-surface-500">Download your expense history</Text>
                        </div>
                    </div>
                </Button>

                <Button
                    onClick={handleHelpSupport}
                    className="w-full p-3 text-left border border-surface-200 rounded-lg hover:bg-surface-50"
                >
                    <div className="flex items-center space-x-3">
                        <ApperIcon name="HelpCircle" size={20} className="text-surface-500" />
                        <div>
                            <Text as="p" className="font-medium text-surface-900">Help & Support</Text>
                            <Text as="p" className="text-sm text-surface-500">Get help using SplitWise AI</Text>
                        </div>
                    </div>
                </Button>

                <Button
                    onClick={handleDeleteAccount}
                    className="w-full p-3 text-left border border-red-200 rounded-lg hover:bg-red-50"
                >
                    <div className="flex items-center space-x-3">
                        <ApperIcon name="Trash2" size={20} className="text-red-500" />
                        <div>
                            <Text as="p" className="font-medium text-red-900">Delete Account</Text>
                            <Text as="p" className="text-sm text-red-600">Permanently delete your account</Text>
                        </div>
                    </div>
                </Button>
            </div>
        </motion.div>
    );
};

export default AccountActionsSection;