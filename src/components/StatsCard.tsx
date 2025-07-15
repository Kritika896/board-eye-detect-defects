
import React from 'react';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  label: string;
  value: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value }) => {
  return (
    <Card className="p-4 text-center bg-white/30 backdrop-blur-sm border-green-300/50">
      <div className="text-2xl font-bold text-green-900 mb-1">{value}</div>
      <div className="text-sm text-green-700">{label}</div>
    </Card>
  );
};

export default StatsCard;
