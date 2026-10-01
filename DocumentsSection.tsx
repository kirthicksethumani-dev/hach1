import React, { useState } from 'react';
import { FileCheck, CheckSquare, Square, Printer, CheckCircle2, AlertCircle } from 'lucide-react';
import { DocumentItem } from '../types/scheme';

interface Props {
  documents: DocumentItem[];
}

export const DocumentsSection: React.FC<Props> = ({ documents }) => {
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const toggleCheck = (docName: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [docName]: !prev[docName],
    }));
  };

  const readyCount = documents.filter((d) => checkedDocs[d.documentName]).length;
  const isAllReady = documents.length > 0 && readyCount === documents.length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            <FileCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Document Readiness</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Required Documents Checklist
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Check off each document as you prepare them before visiting the portal or CSC centre
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            {readyCount} of {documents.length} Ready
          </span>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Checklist</span>
          </button>
        </div>
      </div>

      {isAllReady && (
        <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Great! You have all mandatory documents ready to proceed with application submission.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {documents.map((doc, idx) => {
          const isChecked = !!checkedDocs[doc.documentName];
          return (
            <div
              key={idx}
              onClick={() => toggleCheck(doc.documentName)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                isChecked
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                  : 'bg-slate-50/70 border-slate-200 hover:border-indigo-300 hover:bg-white'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 hover:text-indigo-600 shrink-0"
                aria-label={isChecked ? 'Mark document as not ready' : 'Mark document as ready'}
              >
                {isChecked ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-sm font-bold truncate ${
                      isChecked ? 'text-emerald-950 line-through' : 'text-slate-900'
                    }`}
                  >
                    {doc.documentName}
                  </h4>

                  {doc.isMandatory ? (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 shrink-0">
                      Mandatory
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 shrink-0">
                      Optional
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {doc.purpose}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
