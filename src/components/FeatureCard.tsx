
import React from 'react';
import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="p-6 text-center bg-white/30 backdrop-blur-sm border-green-300/50 hover:bg-white/40 transition-all duration-300">
      <div className="flex justify-center text-green-600 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-green-900 mb-2">{title}</h3>
      <p className="text-green-700 text-sm">{description}</p>
    </Card>
  );
};

export default FeatureCard;
