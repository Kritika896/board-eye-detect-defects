
import { DetectedDefect } from '@/pages/Index';

// Mock defect detection function
// In a real implementation, this would use AI/ML models
export const detectDefects = async (imageUrl: string): Promise<DetectedDefect[]> => {
  console.log('Running defect detection on image...');
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock defects for demonstration
  const mockDefects: DetectedDefect[] = [
    {
      id: '1',
      type: 'short_circuit',
      confidence: 0.92,
      x: 150,
      y: 120,
      width: 40,
      height: 25,
      description: 'Potential short circuit between traces detected'
    },
    {
      id: '2',
      type: 'solder_bridge',
      confidence: 0.85,
      x: 280,
      y: 200,
      width: 30,
      height: 20,
      description: 'Solder bridge connecting adjacent pads'
    },
    {
      id: '3',
      type: 'missing_component',
      confidence: 0.78,
      x: 320,
      y: 80,
      width: 35,
      height: 45,
      description: 'Component appears to be missing from designated location'
    }
  ];

  // Return random subset of defects to simulate real detection
  const numDefects = Math.floor(Math.random() * 4); // 0-3 defects
  const selectedDefects = mockDefects.slice(0, numDefects);
  
  console.log(`Detected ${selectedDefects.length} defects`);
  return selectedDefects;
};

// Utility function to analyze image dimensions
export const getImageDimensions = (imageUrl: string): Promise<{width: number, height: number}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.src = imageUrl;
  });
};

// Color mapping for different defect types
export const getDefectTypeColor = (type: DetectedDefect['type']): string => {
  const colorMap = {
    short_circuit: '#ef4444',      // Red
    open_circuit: '#f97316',       // Orange
    solder_bridge: '#eab308',      // Yellow
    missing_component: '#8b5cf6',  // Purple
    misaligned_component: '#06b6d4' // Cyan
  };
  
  return colorMap[type] || '#6b7280';
};

// Function to validate if coordinates are within image bounds
export const validateDefectCoordinates = (
  defect: DetectedDefect, 
  imageWidth: number, 
  imageHeight: number
): boolean => {
  return (
    defect.x >= 0 && 
    defect.y >= 0 && 
    defect.x + defect.width <= imageWidth && 
    defect.y + defect.height <= imageHeight
  );
};
