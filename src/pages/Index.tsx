
import React, { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import DefectAnalysis from '@/components/DefectAnalysis';
import ResultsPanel from '@/components/ResultsPanel';
import DefectChart from '@/components/DefectChart';
import StatsCard from '@/components/StatsCard';
import FeatureCard from '@/components/FeatureCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Zap, Shield, Target, BarChart3, Eye, CheckCircle } from 'lucide-react';

export interface DetectedDefect {
  id: string;
  type: 'spurious_copper' | 'spur' | 'short' | 'open_circuit' | 'mouse_bite' | 'missing_hole';
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

  const totalDefects = detectedDefects.length;
  const averageConfidence = totalDefects > 0 
    ? Math.round(detectedDefects.reduce((sum, defect) => sum + defect.confidence, 0) / totalDefects * 100)
    : 0;
  const criticalDefects = detectedDefects.filter(d => ['short', 'open_circuit'].includes(d.type)).length;
  const qualityScore = totalDefects === 0 ? 100 : Math.max(0, 100 - (totalDefects * 15) - (criticalDefects * 10));

  return (
    <div className="min-h-screen gradient-green-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-green-800" />
            <span className="text-sm font-medium text-green-800">AI-Powered Detection</span>
          </div>
          
          <h1 className="text-5xl font-bold text-green-900 mb-4">
            PCB Defect Detection
            <span className="block text-3xl font-normal text-green-700 mt-2">
              Precision Quality Control System
            </span>
          </h1>
          
          <p className="text-xl text-green-800 max-w-3xl mx-auto leading-relaxed">
            Advanced AI-powered system that analyzes PCB images to detect manufacturing defects 
            with industry-leading accuracy. Identify issues before they impact production.
          </p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-2xl mx-auto">
            <StatsCard label="Defects Found" value={totalDefects.toString()} />
            <StatsCard label="Accuracy" value={`${averageConfidence}%`} />
            <StatsCard label="Critical Issues" value={criticalDefects.toString()} />
            <StatsCard label="Quality Score" value={`${qualityScore}%`} />
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="Precision Detection"
            description="Identifies 6 types of PCB defects with high accuracy using advanced AI algorithms"
          />
          <FeatureCard
            icon={<Eye className="w-8 h-8" />}
            title="Visual Mapping"
            description="Precise location marking with confidence scores for each detected defect"
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Analytics Dashboard"
            description="Comprehensive charts and statistics for quality control insights"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Upload & Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6 bg-white/90 backdrop-blur-sm border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-green-900">Upload PCB Image</h2>
              </div>
              <ImageUpload 
                onImageUpload={handleImageUpload}
                uploadedImage={uploadedImage}
                onStartAnalysis={handleStartAnalysis}
                isAnalyzing={isAnalyzing}
              />
            </Card>

            {/* Supported Defects Info */}
            <Card className="p-6 bg-white/90 backdrop-blur-sm border-green-200">
              <h3 className="font-semibold text-green-900 mb-3">Detected Defect Types</h3>
              <div className="space-y-2">
                {[
                  { type: 'Spurious Copper', severity: 'Medium' },
                  { type: 'Spur', severity: 'Low' },
                  { type: 'Short Circuit', severity: 'Critical' },
                  { type: 'Open Circuit', severity: 'Critical' },
                  { type: 'Mouse Bite', severity: 'Medium' },
                  { type: 'Missing Hole', severity: 'High' }
                ].map((defect, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-green-800">{defect.type}</span>
                    <Badge variant={
                      defect.severity === 'Critical' ? 'destructive' :
                      defect.severity === 'High' ? 'default' :
                      defect.severity === 'Medium' ? 'secondary' : 'outline'
                    }>
                      {defect.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Results Panel */}
            {detectedDefects.length > 0 && (
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-green-200">
                <ResultsPanel detects={detectedDefects} />
              </Card>
            )}
          </div>

          {/* Right Panel - Analysis & Charts */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white/90 backdrop-blur-sm border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-green-900">Analysis Results</h2>
                {analyzedImage && (
                  <Badge className="ml-auto bg-green-100 text-green-800">
                    Analysis Complete
                  </Badge>
                )}
              </div>
              <DefectAnalysis
                originalImage={uploadedImage}
                analyzedImage={analyzedImage}
                defects={detectedDefects}
                isAnalyzing={isAnalyzing}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </Card>

            {/* Charts Panel */}
            {detectedDefects.length > 0 && (
              <Card className="p-6 bg-white/90 backdrop-blur-sm border-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-green-900">Defect Analytics</h2>
                </div>
                <DefectChart defects={detectedDefects} />
              </Card>
            )}
          </div>
        </div>

        {/* Process Steps */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-green-900 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Upload Image",
                description: "Upload your PCB image in any standard format (JPG, PNG, etc.)"
              },
              {
                step: "2", 
                title: "AI Analysis",
                description: "Our advanced AI model analyzes the image for 6 types of defects"
              },
              {
                step: "3",
                title: "Get Results",
                description: "View detailed results with visual indicators and analytics"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">{item.title}</h3>
                <p className="text-green-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-green-300">
          <p className="text-green-700 text-lg">
            Advanced AI-powered PCB inspection for manufacturing excellence
          </p>
          <p className="text-green-600 text-sm mt-2">
            Trusted by electronics manufacturers worldwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
