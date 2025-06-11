import React from 'react';
import { motion } from 'framer-motion';

const ToggleSwitch = ({ isOn, onToggle, className, ...props }) => {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className={`w-12 h-6 rounded-full p-1 transition-all duration-200 ${isOn ? 'bg-accent' : 'bg-surface-300'} ${className}`}
            {...props}
        >
            <motion.div
                animate={{ x: isOn ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-4 h-4 bg-white rounded-full shadow-md"
            />
        </motion.button>
    );
};

export default ToggleSwitch;