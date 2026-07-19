import { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { inspectionResult } from "../mock/inspectionData";

function Inspect() {
  const [image, setImage] = useState(null);

  const handleImage = (e) => {
    if (e.target.files.length > 0) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Inspect Wafer</h1>
        <p className="text-slate-400 mt-2">
          Upload a wafer image to perform defect detection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>

          <label className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
            <Upload size={40} className="text-blue-400 mb-4" />
            <span>Select Wafer Image</span>

            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImage}
            />
          </label>
        </div>

        {/* Preview */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>

          <div className="h-72 flex items-center justify-center rounded-lg border border-slate-700 overflow-hidden">
            {image ? (
              <img
                src={image}
                alt="preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <ImageIcon size={60} className="text-slate-500" />
            )}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-semibold mb-5">Prediction Result</h2>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-slate-400">Defect Type</p>
            <h3 className="text-xl font-bold">{inspectionResult.defect}</h3>
          </div>

          <div>
            <p className="text-slate-400">Confidence</p>
            <h3 className="text-xl font-bold text-green-400">
              {inspectionResult.confidence}
            </h3>
          </div>

          <div>
            <p className="text-slate-400">Severity</p>
            <h3 className="text-xl font-bold text-yellow-400">
              {inspectionResult.severity}
            </h3>
          </div>

          <div>
            <p className="text-slate-400">Recommendation</p>
            <h3 className="text-lg font-semibold">
              {inspectionResult.recommendation}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inspect;