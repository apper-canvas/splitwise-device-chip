import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from './ApperIcon';
import ExpenseForm from './ExpenseForm';
import BalanceCalculator from './BalanceCalculator';

const MainFeature = () => {
  const [activeFeature, setActiveFeature] = useState('expenses');

  const features = [
    {
      id: 'expenses',
      title: 'Add Expense',
      icon: 'Plus',
      description: 'Track group spending with smart splitting'
    },
    {
      id: 'balance',
      title: 'Balance Calculator',
      icon: 'Calculator',
      description: 'See who owes what with debt simplification'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Feature Selector */}
      <div className="flex space-x-4 mb-8">
        {features.map((feature) => (
          <motion.button
            key={feature.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveFeature(feature.id)}
            className={`flex-1 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              activeFeature === feature.id
                ? 'border-primary bg-primary text-white'
                : 'border-surface-200 bg-white hover:border-primary hover:bg-surface-50'
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <ApperIcon name={feature.icon} size={24} />
              <h3 className="font-heading font-semibold text-lg">{feature.title}</h3>
            </div>
            <p className={`text-sm ${
              activeFeature === feature.id ? 'text-purple-100' : 'text-surface-600'
            }`}>
              {feature.description}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Feature Content */}
      <motion.div
        key={activeFeature}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl border border-surface-200 p-6"
      >
        {activeFeature === 'expenses' && <ExpenseForm />}
        {activeFeature === 'balance' && <BalanceCalculator />}
      </motion.div>
    </div>
  );
};

export default MainFeature;