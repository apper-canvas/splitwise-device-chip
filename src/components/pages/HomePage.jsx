import React from 'react';
import HomeFeatureSection from '@/components/organisms/HomeFeatureSection';
import Text from '@/components/atoms/Text';

const HomePage = () => {
  return (
    <div className="min-h-full bg-surface-50">
      <div className="bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <Text as="h1" className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            SplitWise AI
          </Text>
          <Text as="p" className="text-lg text-purple-100 max-w-2xl mx-auto">
            Smart expense sharing made simple. Track group spending, split costs intelligently, and settle up effortlessly.
          </Text>
        </div>
      </div>
      
      <div className="py-8">
        <HomeFeatureSection />
      </div>
    </div>
  );
};

export default HomePage;