import { Upload, Loader2, X } from "lucide-react";
import { useState } from "react";
import { uploadInspectionImage } from "../services/inspectionservice";

function Batch() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    setMessage("");
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcessBatch = async () => {
    if (selectedFiles.length === 0) {
      setMessage("Please select at least one image");
      return;
    }

    setLoading(true);
    setMessage("");
    setResults([]);

    const batchResults = [];
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      try {
        const result = await uploadInspectionImage(selectedFiles[i]);
        batchResults.push({
          id: result.id,
          filename: selectedFiles[i].name,
          status: "success",
          predicted_class: result.predicted_class,
          confidence: `${Math.round(result.confidence * 100)}%`,
          imageUrl: result.image_url,
        });
        successCount++;
      } catch (err) {
        batchResults.push({
          filename: selectedFiles[i].name,
          status: "error",
          error: err.response?.data?.error?.message || "Upload failed",
        });
        errorCount++;
      }
    }

    setResults(batchResults);
    setMessage(`Batch complete: ${successCount} successful, ${errorCount} failed`);
    setSelectedFiles([]);
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Batch Processing</h1>
        <p className="text-slate-400 mt-2">
          Upload multiple wafer images for automated inspection.
        </p>
      </div>

      {/* File Upload Area */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <label className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
          <Upload className="text-blue-400 mb-4" size={40} />
          <span className="text-lg">Upload Multiple Images</span>
          <span className="text-sm text-slate-400 mt-1">(or drag and drop)</span>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={loading}
            hidden
          />
        </label>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Selected Files ({selectedFiles.length})
          </h2>

          <div className="space-y-2 max-h-48 overflow-y-auto mb-4">
            {selectedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center bg-slate-700 p-3 rounded"
              >
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm">{file.name}</p>
                  <p className="text-xs text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => removeFile(idx)}
                  disabled={loading}
                  className="ml-4 text-red-400 hover:text-red-300 disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleProcessBatch}
            disabled={loading || selectedFiles.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={20} className="animate-spin" />}
            {loading ? "Processing..." : "Process Batch"}
          </button>
        </div>
      )}

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg ${message.includes("failed") && message.includes("0 successful") ? "bg-red-600" : "bg-green-600"} text-white`}>
          {message}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Batch Results</h2>

          <div className="space-y-4">
            {results.map((result, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 ${
                  result.status === "success"
                    ? "bg-slate-700 border-l-green-500"
                    : "bg-slate-700 border-l-red-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold">{result.filename}</p>
                    {result.status === "success" ? (
                      <>
                        <p className="text-sm text-slate-400">
                          Predicted: <span className="text-green-400">{result.predicted_class}</span>
                        </p>
                        <p className="text-sm text-slate-400">
                          Confidence: {result.confidence}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-red-400">{result.error}</p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      result.status === "success"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {result.status === "success" ? "✓ Done" : "✗ Failed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Batch;