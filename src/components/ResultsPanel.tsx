
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { DetectedDefect } from '@/pages/Index';

interface ResultsPanelProps {
  detects: DetectedDefect[];
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ detects }) => {
  const getDefectIcon = (type: string) => {
    switch (type) {
      case 'short':
      case 'open_circuit':
        return <XCircle className="w-4 h-4" />;
      case 'spurious_copper':
      case 'spur':
      case 'mouse_bite':
      case 'missing_hole':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getDefectColor = (type: string) => {
    const colors = {
      spurious_copper: 'destructive',
      spur: 'destructive', 
      short: 'destructive',
      open_circuit: 'destructive',
      mouse_bite: 'secondary',
      missing_hole: 'default'
    };
    return colors[type as keyof typeof colors] || 'default';
  };

  const formatDefectType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const averageConfidence = detects.length > 0 
    ? detects.reduce((sum, defect) => sum + defect.confidence, 0) / detects.length 
    : 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Detection Results</h3>
      
      {/* Summary */}
      <Alert className={detects.length > 0 ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
        <div className="flex items-center">
          {detects.length > 0 ? (
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          ) : (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
          <AlertDescription className="ml-2">
            {detects.length > 0 
              ? `Found ${detects.length} defect${detects.length !== 1 ? 's' : ''} with ${Math.round(averageConfidence * 100)}% average confidence`
              : "No defects detected - PCB appears to be in good condition"
            }
          </AlertDescription>
        </div>
      </Alert>

      {/* Defect List */}
      {detects.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-slate-700">Detected Issues:</h4>
          {detects.map((defect) => (
            <Card key={defect.id} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getDefectIcon(defect.type)}
                  <span className="font-medium text-sm">
                    {formatDefectType(defect.type)}
                  </span>
                </div>
                <Badge variant={getDefectColor(defect.type) as any}>
                  {Math.round(defect.confidence * 100)}%
                </Badge>
              </div>
              <p className="text-xs text-slate-600 mt-1">{defect.description}</p>
              <div className="text-xs text-slate-500 mt-1">
                Position: ({defect.x}, {defect.y}) | Size: {defect.width}×{defect.height}px
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Quality Assessment */}
      <Card className="p-3 bg-slate-50">
        <h4 className="font-medium text-slate-700 mb-2">Quality Assessment</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Overall Status:</span>
            <Badge variant={detects.length === 0 ? "default" : "destructive"}>
              {detects.length === 0 ? "PASS" : "FAIL"}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span>Defects Found:</span>
            <span className="font-medium">{detects.length}</span>
          </div>
          {detects.length > 0 && (
            <div className="flex justify-between">
              <span>Avg. Confidence:</span>
              <span className="font-medium">{Math.round(averageConfidence * 100)}%</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ResultsPanel;
