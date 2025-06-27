import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { detectDefects } from '@/utils/defectDetection';
import { DetectedDefect } from '@/pages/Index';

interface DefectAnalysisProps {
  originalImage: string | null;
  analyzedImage: string | null;
  defects: DetectedDefect[];
  isAnalyzing: boolean;
  onAnalysisComplete: (analyzedImageUrl: string, defects: DetectedDefect[]) => void;
}

const DefectAnalysis: React.FC<DefectAnalysisProps> = ({
  originalImage,
  analyzedImage,
  defects,
  isAnalyzing,
  onAnalysisComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (originalImage && isAnalyzing) {
      // Simulate analysis delay and then process
      const analyzeImage = async () => {
        console.log('Starting defect detection analysis...');
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Detect defects (mock implementation)
        const detectedDefects = await detectDefects(originalImage);
        console.log('Detected defects:', detectedDefects);
        
        // Create analyzed image with defect highlights
        const analyzedImageUrl = await createAnalyzedImage(originalImage, detectedDefects);
        
        onAnalysisComplete(analyzedImageUrl, detectedDefects);
      };

      analyzeImage();
    }
  }, [originalImage, isAnalyzing, onAnalysisComplete]);

  const createAnalyzedImage = async (imageUrl: string, defects: DetectedDefect[]): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(imageUrl);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw original image
        ctx.drawImage(img, 0, 0);
        
        // Draw defect highlights with enhanced visibility
        defects.forEach((defect, index) => {
          const color = getDefectColor(defect.type);
          
          // Draw semi-transparent filled rectangle for better visibility
          ctx.fillStyle = color + '40'; // Add alpha for transparency
          ctx.fillRect(defect.x, defect.y, defect.width, defect.height);
          
          // Draw thick bounding box
          ctx.strokeStyle = color;
          ctx.lineWidth = 4;
          ctx.strokeRect(defect.x, defect.y, defect.width, defect.height);
          
          // Add small corner indicators for better visibility
          const cornerSize = 8;
          ctx.fillStyle = color;
          // Top-left corner
          ctx.fillRect(defect.x - 2, defect.y - 2, cornerSize, cornerSize);
          // Top-right corner
          ctx.fillRect(defect.x + defect.width - 6, defect.y - 2, cornerSize, cornerSize);
          // Bottom-left corner
          ctx.fillRect(defect.x - 2, defect.y + defect.height - 6, cornerSize, cornerSize);
          // Bottom-right corner
          ctx.fillRect(defect.x + defect.width - 6, defect.y + defect.height - 6, cornerSize, cornerSize);
          
          // Draw label with better background
          const labelText = `${defect.type.replace('_', ' ').toUpperCase()} ${Math.round(defect.confidence * 100)}%`;
          const labelWidth = ctx.measureText(labelText).width + 16;
          const labelHeight = 28;
          const labelY = defect.y > labelHeight ? defect.y - labelHeight : defect.y + defect.height + 5;
          
          // Draw label background with shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(defect.x - 2, labelY - 2, labelWidth + 4, labelHeight + 4);
          ctx.fillStyle = color;
          ctx.fillRect(defect.x, labelY, labelWidth, labelHeight);
          
          // Draw label text
          ctx.fillStyle = 'white';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'left';
          ctx.fillText(labelText, defect.x + 8, labelY + 18);
          
          // Add defect number
          ctx.fillStyle = 'white';
          ctx.font = 'bold 16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`${index + 1}`, defect.x + defect.width/2, defect.y + defect.height/2 + 6);
        });
        
        resolve(canvas.toDataURL());
      };
      img.src = imageUrl;
    });
  };

  const getDefectColor = (type: string): string => {
    const colors = {
      spurious_copper: '#dc2626',     // Dark Red
      spur: '#ea580c',               // Orange Red
      short: '#ef4444',              // Red
      open_circuit: '#f97316',       // Orange
      mouse_bite: '#8b5cf6',         // Purple
      missing_hole: '#06b6d4'        // Cyan
    };
    return colors[type as keyof typeof colors] || '#6b7280';
  };

  if (!originalImage) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p>Upload a PCB image to begin analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Analysis Status */}
      {isAnalyzing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent mr-3" />
            <div>
              <p className="font-medium text-blue-800">Analyzing PCB Image</p>
              <p className="text-sm text-blue-600">AI is scanning for defects...</p>
            </div>
          </div>
        </div>
      )}

      {/* Image Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Image */}
        <Card className="p-4">
          <h3 className="font-medium text-slate-700 mb-3">Original Image</h3>
          <div className="relative">
            <img
              src={originalImage}
              alt="Original PCB"
              className="w-full h-64 object-cover rounded-lg border"
            />
            <Badge variant="secondary" className="absolute top-2 right-2">
              Original
            </Badge>
          </div>
        </Card>

        {/* Analyzed Image */}
        <Card className="p-4">
          <h3 className="font-medium text-slate-700 mb-3">Analysis Results</h3>
          <div className="relative">
            {analyzedImage ? (
              <>
                <img
                  src={analyzedImage}
                  alt="Analyzed PCB"
                  className="w-full h-64 object-cover rounded-lg border"
                />
                <Badge 
                  variant={defects.length > 0 ? "destructive" : "default"} 
                  className="absolute top-2 right-2"
                >
                  {defects.length} Defect{defects.length !== 1 ? 's' : ''} Found
                </Badge>
              </>
            ) : (
              <div className="w-full h-64 bg-slate-100 rounded-lg border flex items-center justify-center">
                <p className="text-slate-500">
                  {isAnalyzing ? 'Processing...' : 'No analysis available'}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default DefectAnalysis;
