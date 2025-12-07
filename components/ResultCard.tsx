import React from 'react';
import { FFEAnalysis } from '../types';

interface ResultCardProps {
  analysis: FFEAnalysis;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ analysis, onReset }) => {
  
  const handleDownloadExcel = () => {
    // Add BOM for proper UTF-8 handling in Excel
    const BOM = "\uFEFF";
    
    const headers = ["ID", "Name", "Description"];
    
    const rows = analysis.items.map((item, index) => [
      index + 1,
      `"${item.label.replace(/"/g, '""')}"`, // Escape quotes
      `"${(item.description || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = BOM + [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'FFE_Inventory_List.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col h-full animate-fade-in-up">
      {/* Header */}
      <div className="bg-indigo-600 p-6 text-white flex justify-between items-center flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold">Analysis Complete</h2>
          <p className="text-indigo-100 opacity-90 text-sm mt-1">FF&E Items Detected</p>
        </div>
        <div className="flex flex-col items-center justify-center bg-white/20 backdrop-blur-md rounded-lg p-3 min-w-[80px]">
          <span className="text-3xl font-bold">{analysis.itemCount}</span>
          <span className="text-xs uppercase font-semibold tracking-wider">Items</span>
        </div>
      </div>

      {/* Main Content Area - Flex Column to manage scrolling */}
      <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
        
        {/* Summary Section */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Design Summary</h3>
          <p className="text-slate-700 leading-relaxed text-sm">{analysis.summary}</p>
        </div>

        {/* Table Section - Scrollable */}
        <div className="flex-grow overflow-y-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">
                  #
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-1/3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {analysis.items.map((item, index) => (
                <tr key={item.id} className="hover:bg-indigo-50/60 transition-colors group">
                  <td className="px-6 py-3 whitespace-nowrap align-top">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-slate-900 group-hover:text-indigo-700 transition-colors align-top">
                    {item.label}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-500 align-top">
                    {item.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 bg-slate-50 border-t border-slate-100 mt-auto flex flex-col gap-3 flex-shrink-0">
        <button
          onClick={handleDownloadExcel}
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 group-hover:scale-110 transition-transform">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <path d="M12 18v-6" />
            <path d="m9 15 3 3 3-3" />
          </svg>
          Download Excel Report
        </button>

        <button
          onClick={onReset}
          className="w-full py-3 px-4 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 hover:border-slate-400 focus:ring-2 focus:ring-slate-200 transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-500">
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
            <line x1="16" x2="22" y1="5" y2="5" />
            <line x1="19" x2="19" y1="2" y2="8" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          Analyze New Image
        </button>
      </div>
    </div>
  );
};