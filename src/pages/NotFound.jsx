import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
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
        
        <h1 className="text-4xl font-heading font-bold text-surface-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-surface-700 mb-2">Page Not Found</h2>
        <p className="text-surface-500 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary transition-colors"
          >
            Go Back
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 border border-surface-300 text-surface-700 rounded-lg font-medium hover:bg-surface-50 transition-colors"
          >
            Go Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;