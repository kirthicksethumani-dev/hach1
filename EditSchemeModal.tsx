import React, { useState } from 'react';
import { X, Save, Edit3, Check } from 'lucide-react';
import { SchemeAnalysis } from '../types/scheme';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  scheme: SchemeAnalysis;
  onSave: (updatedScheme: SchemeAnalysis) => void;
}

export const EditSchemeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  scheme,
  onSave,
}) => {
  const [formData, setFormData] = useState<SchemeAnalysis>({ ...scheme });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Edit3 className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-base">User-Defined Scheme Text Editor</h3>
              <p className="text-xs text-slate-300">Customize any displayed text, benefits, or criteria directly</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Scheme Name
            </label>
            <input
              type="text"
              required
              value={formData.schemeName}
              onChange={(e) => setFormData({ ...formData, schemeName: e.target.value })}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nodal Ministry / Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Simplified 1-Minute Citizen Summary
            </label>
            <textarea
              rows={3}
              value={formData.simpleExplanation}
              onChange={(e) => setFormData({ ...formData, simpleExplanation: e.target.value })}
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Age Requirement
              </label>
              <input
                type="text"
                value={formData.eligibilityCriteria.ageRequirement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    eligibilityCriteria: {
                      ...formData.eligibilityCriteria,
                      ageRequirement: e.target.value,
                    },
                  })
                }
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Income Requirement
              </label>
              <input
                type="text"
                value={formData.eligibilityCriteria.incomeRequirement}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    eligibilityCriteria: {
                      ...formData.eligibilityCriteria,
                      incomeRequirement: e.target.value,
                    },
                  })
                }
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Occupation / Who Can Apply
            </label>
            <input
              type="text"
              value={formData.eligibilityCriteria.occupationRequirement}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  eligibilityCriteria: {
                    ...formData.eligibilityCriteria,
                    occupationRequirement: e.target.value,
                  },
                })
              }
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Official Portal Website URL
            </label>
            <input
              type="text"
              value={formData.officialSource.websiteUrl || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  officialSource: {
                    ...formData.officialSource,
                    websiteUrl: e.target.value,
                  },
                })
              }
              className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 outline-hidden"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save &amp; Update Display</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
