import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultCard } from './components/ResultCard';
import { AnalysisState, DetectedObject } from './types';
import { analyzeImageForFFE } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    status: 'idle',
    result: null,
    error: null,
    imagePreview: null,
  });

  const handleImageSelected = async (base64: string, mimeType: string) => {
    // Set preview immediately
    const previewUrl = `data:${mimeType};base64,${base64}`;
    
    setState({
      status: 'analyzing',
      result: null,
      error: null,
      imagePreview: previewUrl,
    });

    try {
      const result = await analyzeImageForFFE(base64, mimeType);
      setState(prev => ({
        ...prev,
        status: 'success',
        result: result,
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: "We couldn't analyze the furniture in that image properly. Please try again with a clearer photo.",
      }));
    }
  };

  const handleReset = () => {
    setState({
      status: 'idle',
      result: null,
      error: null,
      imagePreview: null,
    });
  };

  // Helper to render bounding boxes
  const renderBoundingBoxes = (items: DetectedObject[]) => {
    return items.map((item, index) => {
      const [ymin, xmin, ymax, xmax] = item.box_2d;
      const number = index + 1;
      
      const style: React.CSSProperties = {
        top: `${ymin * 100}%`,
        left: `${xmin * 100}%`,
        height: `${(ymax - ymin) * 100}%`,
        width: `${(xmax - xmin) * 100}%`,
        position: 'absolute',
      };

      return (
        <div 
          key={item.id} 
          style={style} 
          className="border-2 border-indigo-500 bg-indigo-500/10 group hover:bg-indigo-500/20 transition-colors cursor-pointer z-10 hover:z-20"
        >
          {/* Number Badge */}
          <div className="absolute -top-3 -left-3 w-6 h-6 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm border border-white z-30">
            {number}
          </div>
          
          {/* Tooltip Label */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-40 pointer-events-none">
            {item.label}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header />
      
      <main className="flex-grow container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {state.status === 'idle' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
             <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Identify FF&E Objects
              </h2>
              <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
                Upload a photo of an interior. Our AI identifies Furniture, Fixtures, and Equipment, marking them directly on your image.
              </p>
            </div>
            
            <ImageUploader onImageSelected={handleImageSelected} disabled={false} />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center mt-12">
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                </div>
                <h3 className="font-semibold text-slate-900">Upload Photo</h3>
                <p className="text-sm text-slate-500 mt-1">Room or Object view</p>
              </div>
              <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m7.8 16.2-2.9 2.9"/><path d="M6 12H2"/><path d="m7.8 7.8-2.9-2.9"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
                <h3 className="font-semibold text-slate-900">Scan FF&E</h3>
                <p className="text-sm text-slate-500 mt-1">Gemini 3 Pro Vision</p>
              </div>
               <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>
                </div>
                <h3 className="font-semibold text-slate-900">Get Inventory</h3>
                <p className="text-sm text-slate-500 mt-1">Itemized list & map</p>
              </div>
            </div>
          </div>
        )}

        {state.status !== 'idle' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full animate-fade-in items-start">
            {/* Left Column: Image Preview with Overlays */}
            <div className="space-y-6 sticky top-24">
              <div className="relative group rounded-2xl overflow-hidden bg-slate-900 shadow-lg ring-1 ring-slate-900/5 aspect-auto flex items-center justify-center">
                 {state.imagePreview && (
                   <div className="relative w-full h-auto">
                     <img 
                      src={state.imagePreview} 
                      alt="Analyzed content" 
                      className="w-full h-auto object-contain block" 
                     />
                     {/* Bounding Boxes Layer */}
                     {state.status === 'success' && state.result && (
                       <div className="absolute inset-0">
                         {renderBoundingBoxes(state.result.items)}
                       </div>
                     )}
                   </div>
                 )}
                 {state.status === 'analyzing' && (
                   <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-10 min-h-[300px]">
                      <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16">
                          <div className="absolute inset-0 border-t-4 border-indigo-500 rounded-full animate-spin"></div>
                          <div className="absolute inset-2 border-t-4 border-white/30 rounded-full animate-spin"></div>
                        </div>
                        <p className="text-white font-medium mt-4 tracking-wide animate-pulse">Identifying objects...</p>
                      </div>
                   </div>
                 )}
              </div>
              
              {state.status === 'error' && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{state.error}</p>
                      <button 
                        onClick={handleReset}
                        className="mt-2 text-sm font-medium text-red-700 hover:text-red-600 underline"
                      >
                        Try another image
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Results */}
            <div className="relative min-h-[400px] h-full">
              {state.status === 'success' && state.result && (
                <ResultCard analysis={state.result} onReset={handleReset} />
              )}
              
              {state.status === 'analyzing' && (
                <div className="h-full bg-white rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4">
                  <div className="h-24 bg-slate-100 rounded-xl animate-pulse w-full mb-8"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-3/4"></div>
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-1/2"></div>
                    <div className="h-4 bg-slate-100 rounded animate-pulse w-5/6"></div>
                  </div>
                  <div className="pt-8 space-y-4">
                    <div className="h-12 bg-slate-50 rounded-lg animate-pulse w-full"></div>
                    <div className="h-12 bg-slate-50 rounded-lg animate-pulse w-full"></div>
                    <div className="h-12 bg-slate-50 rounded-lg animate-pulse w-full"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} FF&E Analyzer. Built with Gemini API & React.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;