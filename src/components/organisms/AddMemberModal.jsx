import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import memberService from '@/services/api/memberService';

const AddMemberModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    initialData = null, 
    mode = 'add' // 'add' or 'edit'
}) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [phoneError, setPhoneError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    name: initialData.name || '',
                    email: initialData.email || '',
                    phone: initialData.phone || ''
                });
            } else {
                setFormData({
                    name: '',
                    email: '',
                    phone: ''
                });
            }
            setPhoneError('');
        }
    }, [isOpen, initialData]);

    const handlePhoneChange = (e) => {
        const formatted = memberService.formatPhone(e.target.value);
        setFormData(prev => ({ ...prev, phone: formatted }));
        
        if (phoneError) {
            setPhoneError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
            return;
        }

        // Validate phone number
        if (!memberService.validatePhone(formData.phone)) {
            setPhoneError('Please enter a valid phone number in format (123) 456-7890');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim()
            });
        } catch (error) {
            console.error('Failed to submit member:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={handleClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <Text as="h2" className="text-xl font-heading font-semibold text-surface-900">
                                        {mode === 'edit' ? 'Edit Member' : 'Add New Member'}
                                    </Text>
                                    <Button
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                        className="p-2 text-surface-400 hover:text-surface-600 rounded-lg hover:bg-surface-100 !hover:scale-100 !active:scale-95"
                                    >
                                        <ApperIcon name="X" size={20} />
                                    </Button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <FormField label="Full Name" required>
                                        <Input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Enter full name"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </FormField>

                                    <FormField label="Email Address" required>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            placeholder="Enter email address"
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </FormField>

                                    <FormField label="Phone Number" required>
                                        <Input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handlePhoneChange}
                                            placeholder="(123) 456-7890"
                                            className={phoneError ? 'border-red-500 focus:ring-red-500' : ''}
                                            required
                                            disabled={isSubmitting}
                                            maxLength={14}
                                        />
                                        {phoneError && (
                                            <Text className="text-xs text-red-500 mt-1">{phoneError}</Text>
                                        )}
                                    </FormField>

                                    <div className="flex space-x-3 pt-4 border-t border-surface-200">
                                        <Button
                                            type="button"
                                            onClick={handleClose}
                                            disabled={isSubmitting}
                                            className="flex-1 px-4 py-3 border border-surface-300 text-surface-700 rounded-lg hover:bg-surface-50"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={
                                                !formData.name.trim() || 
                                                !formData.email.trim() || 
                                                !formData.phone.trim() || 
                                                isSubmitting
                                            }
                                            className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    {mode === 'edit' ? 'Updating...' : 'Adding...'}
                                                </>
                                            ) : (
                                                mode === 'edit' ? 'Update Member' : 'Add Member'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddMemberModal;