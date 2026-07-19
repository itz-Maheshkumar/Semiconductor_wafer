import { X } from "lucide-react";
import { useState } from "react";

function FeedbackModal({ isOpen, onClose, onSubmit, isLoading }) {
  const [correctedClass, setCorrectedClass] = useState("");

  const handleSubmit = () => {
    if (!correctedClass.trim()) {
      alert("Please enter the correct defect class");
      return;
    }
    onSubmit(correctedClass);
    setCorrectedClass("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-xl p-6 w-96 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Correct Prediction</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Enter the correct defect class:
            </label>
            <input
              type="text"
              value={correctedClass}
              onChange={(e) => setCorrectedClass(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="e.g., Center, Donut, Edge-Loc"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              autoFocus
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-slate-700 hover:bg-slate-600 p-3 rounded-lg font-semibold disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !correctedClass.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold disabled:opacity-60"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackModal;
