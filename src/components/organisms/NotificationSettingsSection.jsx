import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';

const NotificationSettingsSection = ({ notifications, onNotificationToggle, className, ...props }) => {
    const labels = {
        expenseAdded: 'New expense added',
        balanceUpdated: 'Balance updated',
        paymentReceived: 'Payment received',
        groupInvites: 'Group invitations'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`bg-white rounded-xl border border-surface-200 p-6 ${className}`}
            {...props}
        >
            <div className="flex items-center space-x-3 mb-4">
                <ApperIcon name="Bell" className="text-primary" size={24} />
                <Text as="h2" className="text-lg font-heading font-semibold text-surface-900">Notifications</Text>
            </div>

            <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-2">
                        <Text as="span" className="text-surface-900 font-medium">{labels[key]}</Text>
                        <ToggleSwitch
                            isOn={value}
                            onToggle={() => onNotificationToggle(key)}
                        />
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default NotificationSettingsSection;