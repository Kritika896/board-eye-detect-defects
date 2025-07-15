
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Image as ImageIcon, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  uploadedImage: string | null;
  onStartAnalysis: () => void;
  isAnalyzing: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUpload,
  uploadedImage,
  onStartAnalysis,
  isAnalyzing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          onImageUpload(imageUrl);
          toast({
            title: "Image uploaded successfully",
            description: "Your PCB image is ready for analysis.",
          });
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageUpload(imageUrl);
        toast({
          title: "Image uploaded successfully",
          description: "Your PCB image is ready for analysis.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className="border-2 border-dashed border-green-300 hover:border-green-500 transition-colors cursor-pointer p-8 bg-green-50/50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <p className="text-green-700 mb-2 font-medium">
            Drag & drop your PCB image here, or click to browse
          </p>
          <p className="text-sm text-green-600">
            Supports JPG, PNG, and other image formats
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </Card>

      {/* Preview */}
      {uploadedImage && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={uploadedImage}
              alt="Uploaded PCB"
              className="w-full h-48 object-cover rounded-lg border-2 border-green-200"
            />
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center shadow-lg">
              <ImageIcon className="w-4 h-4 mr-1" />
              Ready
            </div>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={onStartAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Analyzing PCB...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Start AI Analysis
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
