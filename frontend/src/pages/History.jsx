import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../services/historyservice";

function History() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getHistory();
        setHistoryData(data);
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Inspection History</h1>
        <p className="text-slate-400 mt-2">
          Review previous wafer inspection results.
        </p>
      </div>

      {loading ? (
        <div className="text-center text-slate-400">Loading history...</div>
      ) : historyData.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-lg">No inspection history yet</p>
          <p className="text-slate-500 text-sm mt-2">
            Start by uploading an image in the Inspect section.
          </p>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900">
              <tr>
                <th className="p-4 text-left">Prediction ID</th>
                <th className="text-left">Date</th>
                <th className="text-left">Defect Class</th>
                <th className="text-left">Confidence</th>
                <th className="text-left">Feedback Status</th>
              </tr>
            </thead>

            <tbody>
              {historyData.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/history/${item.id}`)}
                  className="border-t border-slate-700 hover:bg-slate-700 transition cursor-pointer"
                >
                  <td className="p-4 font-medium font-mono text-sm">{item.id}</td>
                  <td>{item.date}</td>
                  <td className="font-semibold text-green-400">{item.defect}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">{item.confidence}</div>
                      <div className="w-24 bg-slate-600 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: item.confidence }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        item.status === "Reviewed"
                          ? "bg-green-600 text-white"
                          : "bg-yellow-600 text-white"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default History;