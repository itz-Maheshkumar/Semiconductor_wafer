import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import api from "../services/api";
import { submitFeedback } from "../services/inspectionservice";
import FeedbackModal from "../components/ui/FeedbackModal";

function HistoryDetail() {
  const { predictionId } = useParams();
  const navigate = useNavigate();

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    const loadPrediction = async () => {
      try {
        const response = await api.get(`/predictions/${predictionId}`);
        setPrediction(response.data);
      } catch (err) {
        setError(err.response?.data?.error?.message || "Failed to load prediction");
      } finally {
        setLoading(false);
      }
    };
    loadPrediction();
  }, [predictionId]);

  const handleFeedback = async (isCorrect, correctedClass = null) => {
    if (!prediction) return;

    setFeedbackLoading(true);
    setFeedbackMessage("");

    try {
      const payload = isCorrect 
        ? { is_correct: true } 
        : { is_correct: false, corrected_class: correctedClass || "Unknown" };
      
      const updated = await submitFeedback(prediction.id, payload);
      setPrediction(updated);
      setFeedbackMessage("Feedback saved successfully!");
      setShowFeedbackModal(false);
    } catch (err) {
      setFeedbackMessage(err.response?.data?.error?.message || "Failed to submit feedback");
    } finally {
      setFeedbackLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin inline-block mr-2" />
        Loading prediction details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft size={20} />
          Back to History
        </button>
        <div className="bg-red-600 text-white p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft size={20} />
          Back to History
        </button>
        <div className="text-center text-slate-400">Prediction not found</div>
      </div>
    );
  }

  const classProbs = prediction.class_probabilities || {};
  const sortedClasses = Object.entries(classProbs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4"
        >
          <ArrowLeft size={20} />
          Back to History
        </button>

        <h1 className="text-3xl font-bold">Inspection Details</h1>
        <p className="text-slate-400 mt-2">
          Prediction ID: <span className="text-slate-300">{prediction.id}</span>
        </p>
        <p className="text-slate-400">
          Date: {new Date(prediction.created_at).toLocaleString()}
        </p>
      </div>

      {/* Images */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <h2 className="font-semibold mb-4">Original Image</h2>
          <img
            src={prediction.image_url}
            alt="Inspection"
            className="w-full rounded-lg bg-slate-900"
          />
        </div>

        {/* Heatmap */}
        {prediction.heatmap_url && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <h2 className="font-semibold mb-4">GradCAM Heatmap</h2>
            <img
              src={prediction.heatmap_url}
              alt="Heatmap"
              className="w-full rounded-lg bg-slate-900"
            />
            <p className="text-sm text-slate-400 mt-2">
              Red areas indicate regions contributing to the prediction
            </p>
          </div>
        )}
      </div>

      {/* Prediction Results */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Prediction Results</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Main Prediction */}
          <div>
            <p className="text-slate-400 mb-2">Predicted Class</p>
            <p className="text-4xl font-bold text-green-400 mb-4">
              {prediction.predicted_class}
            </p>

            <p className="text-slate-400 mb-2">Confidence Score</p>
            <div className="mb-4">
              <p className="text-2xl font-bold mb-2">
                {Math.round(prediction.confidence * 100)}%
              </p>
              <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all"
                  style={{ width: `${prediction.confidence * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Class Probabilities */}
          <div>
            <p className="text-slate-400 mb-4 font-semibold">Top Predictions</p>
            <div className="space-y-3">
              {sortedClasses.map(([className, prob]) => (
                <div key={className}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{className}</span>
                    <span className="text-slate-400">{Math.round(prob * 100)}%</span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        className === prediction.predicted_class
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${prob * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">User Feedback</h2>

        {prediction.feedback ? (
          <div className="space-y-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <p className="text-sm text-slate-400 mb-2">Status</p>
              <p className={`font-semibold ${prediction.feedback.is_correct ? "text-green-400" : "text-yellow-400"}`}>
                {prediction.feedback.is_correct ? "✓ Prediction Correct" : "✗ Prediction Incorrect"}
              </p>
            </div>

            {prediction.feedback.corrected_class && (
              <div className="bg-slate-700 p-4 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">Correct Class</p>
                <p className="font-semibold text-blue-400">{prediction.feedback.corrected_class}</p>
              </div>
            )}

            <p className="text-sm text-slate-400">
              Feedback submitted: {new Date(prediction.feedback.submitted_at).toLocaleString()}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-slate-400 mb-4">
              No feedback submitted yet. Help improve the model by providing feedback:
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => handleFeedback(true)}
                disabled={feedbackLoading}
                className="flex-1 bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold disabled:opacity-60"
              >
                {feedbackLoading ? "Saving..." : "✓ Prediction is Correct"}
              </button>

              <button
                onClick={() => setShowFeedbackModal(true)}
                disabled={feedbackLoading}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 p-3 rounded-lg font-semibold disabled:opacity-60"
              >
                {feedbackLoading ? "Saving..." : "✗ Prediction is Incorrect"}
              </button>
            </div>

            <FeedbackModal
              isOpen={showFeedbackModal}
              onClose={() => setShowFeedbackModal(false)}
              onSubmit={(correctedClass) => handleFeedback(false, correctedClass)}
              isLoading={feedbackLoading}
            />
          </div>
        )}

        {feedbackMessage && (
          <div className={`mt-4 p-3 rounded-lg ${feedbackMessage.includes("successfully") ? "bg-green-600" : "bg-red-600"} text-white text-sm`}>
            {feedbackMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryDetail;
