import { DetectedDefect } from '@/pages/Index';

// Enhanced mock defect detection function with improved accuracy
// In a real implementation, this would use AI/ML models trained on PCB defect datasets
export const detectDefects = async (imageUrl: string): Promise<DetectedDefect[]> => {
  console.log('Running enhanced defect detection on image...');
  
  // Simulate processing time for more realistic AI analysis
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Get image dimensions for better coordinate mapping
  const dimensions = await getImageDimensions(imageUrl);
  const { width, height } = dimensions;
  
  // Enhanced mock defects with more realistic detection patterns
  const mockDefects: DetectedDefect[] = [
    {
      id: '1',
      type: 'spurious_copper',
      confidence: 0.94,
      x: Math.floor(width * 0.15),
      y: Math.floor(height * 0.25),
      width: Math.floor(width * 0.08),
      height: Math.floor(height * 0.06),
      description: 'Unwanted copper residue detected on board surface'
    },
    {
      id: '2',
      type: 'spur',
      confidence: 0.89,
      x: Math.floor(width * 0.35),
      y: Math.floor(height * 0.15),
      width: Math.floor(width * 0.05),
      height: Math.floor(height * 0.12),
      description: 'Copper spur extending from trace detected'
    },
    {
      id: '3',
      type: 'short',
      confidence: 0.91,
      x: Math.floor(width * 0.55),
      y: Math.floor(height * 0.35),
      width: Math.floor(width * 0.07),
      height: Math.floor(height * 0.04),
      description: 'Short circuit between adjacent traces'
    },
    {
      id: '4',
      type: 'open_circuit',
      confidence: 0.87,
      x: Math.floor(width * 0.25),
      y: Math.floor(height * 0.55),
      width: Math.floor(width * 0.06),
      height: Math.floor(height * 0.03),
      description: 'Open circuit - trace discontinuity detected'
    },
    {
      id: '5',
      type: 'mouse_bite',
      confidence: 0.83,
      x: Math.floor(width * 0.65),
      y: Math.floor(height * 0.65),
      width: Math.floor(width * 0.04),
      height: Math.floor(height * 0.04),
      description: 'Mouse bite defect at board edge'
    },
    {
      id: '6',
      type: 'missing_hole',
      confidence: 0.92,
      x: Math.floor(width * 0.45),
      y: Math.floor(height * 0.75),
      width: Math.floor(width * 0.03),
      height: Math.floor(height * 0.03),
      description: 'Missing drill hole detected'
    }
  ];

  // Simulate more realistic detection with varying accuracy
  // Higher chance to detect more critical defects
  const detectionProbability = {
    spurious_copper: 0.85,
    spur: 0.75,
    short: 0.90,
    open_circuit: 0.80,
    mouse_bite: 0.70,
    missing_hole: 0.85
  };

  const detectedDefects = mockDefects.filter(defect => {
    const probability = detectionProbability[defect.type as keyof typeof detectionProbability];
    return Math.random() < probability;
  });

  // Ensure at least one defect is sometimes detected for demo purposes
  if (detectedDefects.length === 0 && Math.random() < 0.6) {
    detectedDefects.push(mockDefects[Math.floor(Math.random() * mockDefects.length)]);
  }

  console.log(`Enhanced detection completed: ${detectedDefects.length} defects found`);
  return detectedDefects;
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
