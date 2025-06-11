import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            y: { repeat: Infinity, duration: 3 },
            rotate: { repeat: Infinity, duration: 4 }
          }}
          className="mb-8"
        >
          <ApperIcon name="Search" className="w-24 h-24 text-surface-300 mx-auto" />
        </motion.div>
        
        <Text as="h1" className="text-4xl font-heading font-bold text-surface-900 mb-4">404</Text>
        <Text as="h2" className="text-xl font-semibold text-surface-700 mb-2">Page Not Found</Text>
        <Text as="p" className="text-surface-500 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </Text>
        
        <div className="space-y-3">
          <Button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary"
          >
            Go Back
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 border border-surface-300 text-surface-700 rounded-lg font-medium hover:bg-surface-50"
          >
            Go Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;