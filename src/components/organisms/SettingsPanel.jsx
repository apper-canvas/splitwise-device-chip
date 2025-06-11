import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Text from '@/components/atoms/Text';
import CurrencySettingsSection from '@/components/organisms/CurrencySettingsSection';
import NotificationSettingsSection from '@/components/organisms/NotificationSettingsSection';
import PreferencesSettingsSection from '@/components/organisms/PreferencesSettingsSection';
import AccountActionsSection from '@/components/organisms/AccountActionsSection';

const SettingsPanel = ({ className, ...props }) => {
    const [settings, setSettings] = useState({
        defaultCurrency: 'USD',
        notifications: {
            expenseAdded: true,
            balanceUpdated: true,
            paymentReceived: true,
            groupInvites: true
        },
        preferences: {
            defaultSplitType: 'equal',
            showDecimalPlaces: 2,
            darkMode: false
        }
    });

    const handleCurrencyChange = (currency) => {
        setSettings(prev => ({
            ...prev,
            defaultCurrency: currency
        }));
        toast.success(`Default currency changed to ${currency}`);
    };

    const handleNotificationToggle = (key) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: !prev.notifications[key]
            }
        }));
        toast.success('Notification settings updated');
    };

    const handlePreferenceChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [key]: value
            }
        }));
        toast.success('Preference updated');
    };

    return (
        <div className={`p-6 max-w-2xl mx-auto ${className}`} {...props}>
            <div className="mb-8">
                <Text as="h1" className="text-2xl font-heading font-bold text-surface-900 mb-2">Settings</Text>
                <Text as="p" className="text-surface-600">Customize your SplitWise AI experience</Text>
            </div>

            <div className="space-y-8">
                <CurrencySettingsSection
                    defaultCurrency={settings.defaultCurrency}
                    onCurrencyChange={handleCurrencyChange}
                />
                <NotificationSettingsSection
                    notifications={settings.notifications}
                    onNotificationToggle={handleNotificationToggle}
                />
                <PreferencesSettingsSection
                    preferences={settings.preferences}
                    onPreferenceChange={handlePreferenceChange}
                />
                <AccountActionsSection />
            </div>
        </div>
    );
};

export default SettingsPanel;