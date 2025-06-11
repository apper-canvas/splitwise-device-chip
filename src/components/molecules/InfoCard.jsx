import React from 'react';
import { motion } from 'framer-motion';

const InfoCard = ({ children, className, delay = 0, whileHover = { scale: 1.02 }, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.1 }}
            whileHover={whileHover}
            className={`bg-white rounded-xl border border-surface-200 p-6 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default InfoCard;