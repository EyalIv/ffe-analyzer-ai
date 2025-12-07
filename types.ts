export interface DetectedObject {
  id: string; // Unique ID for UI mapping
  label: string;
  description: string;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
}

export interface FFEAnalysis {
  itemCount: number;
  summary: string;
  items: DetectedObject[];
  confidenceScore: number;
}

export interface AnalysisState {
  status: 'idle' | 'analyzing' | 'success' | 'error';
  result: FFEAnalysis | null;
  error: string | null;
  imagePreview: string | null;
}