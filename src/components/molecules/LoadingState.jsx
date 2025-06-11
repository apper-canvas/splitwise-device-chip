import React from 'react';
import { motion } from 'framer-motion';

const LoadingState = ({ count = 3, className, ...props }) => {
    return (
        <div className={`space-y-4 ${className}`} {...props}>
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white rounded-lg p-6 shadow-sm animate-pulse"
                >
                    <div className="h-6 bg-surface-200 rounded w-1/3 mb-4"></div>
                    <div className="flex space-x-3 mb-4">
                        {[...Array(3)].map((_, j) => (
                            <div key={j} className="w-10 h-10 bg-surface-200 rounded-full"></div>
                        ))}
                    </div>
                    <div className="h-4 bg-surface-200 rounded w-1/4"></div>
                </motion.div>
            ))}
        </div>
    );
};

export default LoadingState;