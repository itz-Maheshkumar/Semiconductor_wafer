import { useState } from "react";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { uploadInspectionImage, submitFeedback } from "../services/inspectionservice";

function Inspect() {
  const [image, setImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inspectionResult, setInspectionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleImage = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImage(URL.createObjectURL(file));
      setInspectionResult(null);
      setFeedbackMessage("");
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setFeedbackMessage("");

    try {
      const result = await uploadInspectionImage(selectedFile);
      setInspectionResult(result);
    } catch (err) {
      setFeedbackMessage(err.response?.data?.error?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (isCorrect) => {
    if (!inspectionResult) return;

    setFeedbackLoading(true);
    setFeedbackMessage("");

    try {
      const payload = isCorrect ? { is_correct: true } : { is_correct: false, corrected_class: "Scratch" };
      const updated = await submitFeedback(inspectionResult.id, payload);
      setInspectionResult(updated);
      setFeedbackMessage("Feedback saved");
    } catch (err) {
      setFeedbackMessage(err.response?.data?.error?.message || "Feedback failed");
    } finally {
      setFeedbackLoading(false);
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

          {selectedFile && (
            <button
              onClick={handlePredict}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-semibold flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : null}
              {loading ? "Predicting..." : "Run Prediction"}
            </button>
          )}
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

        {feedbackMessage ? <p className="text-sm text-slate-300 mb-4">{feedbackMessage}</p> : null}

        {inspectionResult ? (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-slate-400">Defect Type</p>
              <h3 className="text-xl font-bold">{inspectionResult.predicted_class}</h3>
            </div>

            <div>
              <p className="text-slate-400">Confidence</p>
              <h3 className="text-xl font-bold text-green-400">
                {`${Math.round(inspectionResult.confidence * 100)}%`}
              </h3>
            </div>

            <div>
              <p className="text-slate-400">Image</p>
              <a href={`http://localhost:8000${inspectionResult.image_url}`} target="_blank" rel="noreferrer" className="text-blue-400 underline">
                View uploaded image
              </a>
            </div>

            <div>
              <p className="text-slate-400">Heatmap</p>
              {inspectionResult.heatmap_url ? (
                <a href={`http://localhost:8000${inspectionResult.heatmap_url}`} target="_blank" rel="noreferrer" className="text-blue-400 underline">
                  View heatmap
                </a>
              ) : (
                <span className="text-slate-500">Unavailable</span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-slate-400">Upload and run a prediction to see the result.</p>
        )}

        {inspectionResult ? (
          <div className="mt-6 flex gap-3">
            <button
              className="bg-green-600 hover:bg-green-700 rounded-lg px-4 py-2"
              onClick={() => handleFeedback(true)}
              disabled={feedbackLoading}
            >
              {feedbackLoading ? "Saving..." : "Confirm Prediction"}
            </button>
            <button
              className="bg-yellow-600 hover:bg-yellow-700 rounded-lg px-4 py-2"
              onClick={() => handleFeedback(false)}
              disabled={feedbackLoading}
            >
              {feedbackLoading ? "Saving..." : "Report Correction"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Inspect;