import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';

const Settings = () => {
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

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }
  ];

  const splitTypes = [
    { id: 'equal', label: 'Split Equally' },
    { id: 'percentage', label: 'By Percentage' },
    { id: 'exact', label: 'Exact Amounts' }
  ];

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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-surface-900 mb-2">Settings</h1>
        <p className="text-surface-600">Customize your SplitWise AI experience</p>
      </div>

      <div className="space-y-8">
        {/* Currency Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-surface-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <ApperIcon name="DollarSign" className="text-primary" size={24} />
            <h2 className="text-lg font-heading font-semibold text-surface-900">Currency</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-3">
              Default Currency
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {currencies.map(currency => (
                <motion.button
                  key={currency.code}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCurrencyChange(currency.code)}
                  className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                    settings.defaultCurrency === currency.code
                      ? 'border-primary bg-primary text-white'
                      : 'border-surface-200 hover:border-primary hover:bg-surface-50'
                  }`}
                >
                  <div className="font-medium">{currency.symbol} {currency.code}</div>
                  <div className={`text-sm ${
                    settings.defaultCurrency === currency.code ? 'text-purple-100' : 'text-surface-500'
                  }`}>
                    {currency.name}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-surface-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <ApperIcon name="Bell" className="text-primary" size={24} />
            <h2 className="text-lg font-heading font-semibold text-surface-900">Notifications</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => {
              const labels = {
                expenseAdded: 'New expense added',
                balanceUpdated: 'Balance updated',
                paymentReceived: 'Payment received',
                groupInvites: 'Group invitations'
              };

              return (
                <div key={key} className="flex items-center justify-between py-2">
                  <span className="text-surface-900 font-medium">{labels[key]}</span>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNotificationToggle(key)}
                    className={`w-12 h-6 rounded-full p-1 transition-all duration-200 ${
                      value ? 'bg-accent' : 'bg-surface-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: value ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-4 h-4 bg-white rounded-full shadow-md"
                    />
                  </motion.button>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-surface-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <ApperIcon name="Settings" className="text-primary" size={24} />
            <h2 className="text-lg font-heading font-semibold text-surface-900">Preferences</h2>
          </div>

          <div className="space-y-6">
            {/* Default Split Type */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-3">
                Default Split Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {splitTypes.map(type => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handlePreferenceChange('defaultSplitType', type.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-all duration-200 ${
                      settings.preferences.defaultSplitType === type.id
                        ? 'border-primary bg-primary text-white'
                        : 'border-surface-200 hover:border-primary hover:bg-surface-50'
                    }`}
                  >
                    {type.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Decimal Places */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-3">
                Decimal Places
              </label>
              <select
                value={settings.preferences.showDecimalPlaces}
                onChange={(e) => handlePreferenceChange('showDecimalPlaces', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-surface-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={0}>0 (Whole numbers)</option>
                <option value={2}>2 (Standard)</option>
                <option value={4}>4 (Precise)</option>
              </select>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="text-surface-900 font-medium">Dark Mode</span>
                <p className="text-sm text-surface-500">Switch to dark theme</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePreferenceChange('darkMode', !settings.preferences.darkMode)}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-200 ${
                  settings.preferences.darkMode ? 'bg-primary' : 'bg-surface-300'
                }`}
              >
                <motion.div
                  animate={{ x: settings.preferences.darkMode ? 24 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className="w-4 h-4 bg-white rounded-full shadow-md"
                />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-surface-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <ApperIcon name="Shield" className="text-primary" size={24} />
            <h2 className="text-lg font-heading font-semibold text-surface-900">Account</h2>
          </div>

          <div className="space-y-3">
            <button className="w-full p-3 text-left border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Download" size={20} className="text-surface-500" />
                <div>
                  <p className="font-medium text-surface-900">Export Data</p>
                  <p className="text-sm text-surface-500">Download your expense history</p>
                </div>
              </div>
            </button>

            <button className="w-full p-3 text-left border border-surface-200 rounded-lg hover:bg-surface-50 transition-colors">
              <div className="flex items-center space-x-3">
                <ApperIcon name="HelpCircle" size={20} className="text-surface-500" />
                <div>
                  <p className="font-medium text-surface-900">Help & Support</p>
                  <p className="text-sm text-surface-500">Get help using SplitWise AI</p>
                </div>
              </div>
            </button>

            <button className="w-full p-3 text-left border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Trash2" size={20} className="text-red-500" />
                <div>
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-sm text-red-600">Permanently delete your account</p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;