import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';
import Select from '@/components/atoms/Select';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';
import Button from '@/components/atoms/Button';

const splitTypes = [
    { id: 'equal', label: 'Split Equally' },
    { id: 'percentage', label: 'By Percentage' },
    { id: 'exact', label: 'Exact Amounts' }
];

const PreferencesSettingsSection = ({ preferences, onPreferenceChange, className, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-white rounded-xl border border-surface-200 p-6 ${className}`}
            {...props}
        >
            <div className="flex items-center space-x-3 mb-4">
                <ApperIcon name="Settings" className="text-primary" size={24} />
                <Text as="h2" className="text-lg font-heading font-semibold text-surface-900">Preferences</Text>
            </div>

            <div className="space-y-6">
                {/* Default Split Type */}
                <div>
                    <Text as="label" className="block text-sm font-medium text-surface-700 mb-3">
                        Default Split Type
                    </Text>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {splitTypes.map(type => (
                            <Button
                                key={type.id}
                                onClick={() => onPreferenceChange('defaultSplitType', type.id)}
                                className={`p-3 rounded-lg border-2 text-center !hover:scale-100 !active:scale-98 ${
                                    preferences.defaultSplitType === type.id
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-surface-200 hover:border-primary hover:bg-surface-50'
                                }`}
                            >
                                {type.label}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Decimal Places */}
                <div>
                    <Text as="label" className="block text-sm font-medium text-surface-700 mb-3">
                        Decimal Places
                    </Text>
                    <Select
                        value={preferences.showDecimalPlaces}
                        onChange={(e) => onPreferenceChange('showDecimalPlaces', parseInt(e.target.value))}
                    >
                        <option value={0}>0 (Whole numbers)</option>
                        <option value={2}>2 (Standard)</option>
                        <option value={4}>4 (Precise)</option>
                    </Select>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between py-2">
                    <div>
                        <Text as="span" className="text-surface-900 font-medium">Dark Mode</Text>
                        <Text as="p" className="text-sm text-surface-500">Switch to dark theme</Text>
                    </div>
                    <ToggleSwitch
                        isOn={preferences.darkMode}
                        onToggle={() => onPreferenceChange('darkMode', !preferences.darkMode)}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default PreferencesSettingsSection;