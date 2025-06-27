
import React, { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import DefectAnalysis from '@/components/DefectAnalysis';
import ResultsPanel from '@/components/ResultsPanel';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export interface DetectedDefect {
  id: string;
  type: 'short_circuit' | 'open_circuit' | 'solder_bridge' | 'missing_component' | 'misaligned_component';
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
}

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [analyzedImage, setAnalyzedImage] = useState<string | null>(null);
  const [detectedDefects, setDetectedDefects] = useState<DetectedDefect[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setAnalyzedImage(null);
    setDetectedDefects([]);
  };

  const handleAnalysisComplete = (analyzedImageUrl: string, defects: DetectedDefect[]) => {
    setAnalyzedImage(analyzedImageUrl);
    setDetectedDefects(defects);
    setIsAnalyzing(false);
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-3">
            PCB Defect Detection System
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Upload your PCB images and let our AI-powered system detect and highlight manufacturing defects with precision.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Image Upload */}
          <div className="lg:col-span-1">
            <Card className="p-6 h-fit">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Upload PCB Image</h2>
              <ImageUpload 
                onImageUpload={handleImageUpload}
                uploadedImage={uploadedImage}
                onStartAnalysis={handleStartAnalysis}
                isAnalyzing={isAnalyzing}
              />
            </Card>

            {/* Results Panel */}
            {detectedDefects.length > 0 && (
              <Card className="p-6 mt-6">
                <ResultsPanel detects={detectedDefects} />
              </Card>
            )}
          </div>

          {/* Right Panel - Analysis Display */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Analysis Results</h2>
              <DefectAnalysis
                originalImage={uploadedImage}
                analyzedImage={analyzedImage}
                defects={detectedDefects}
                isAnalyzing={isAnalyzing}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-slate-500">
          <p>AI-powered PCB inspection for quality assurance and manufacturing optimization</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
