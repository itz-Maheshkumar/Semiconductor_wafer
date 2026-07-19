import { Upload } from "lucide-react";
import { getBatchJobs } from "../services/batchService";

function Batch() {
  const batchJobs = getBatchJobs();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Batch Processing</h1>
        <p className="text-slate-400 mt-2">
          Upload multiple wafer images for automated inspection.
        </p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <label className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-blue-500 transition">
          <Upload className="text-blue-400 mb-4" size={40} />
          <span>Upload Multiple Images</span>

          <input type="file" multiple hidden />
        </label>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Batch Queue</h2>

        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-slate-700">
              <th className="py-3">Batch</th>
              <th>Images</th>
              <th>Status</th>
              <th>Accuracy</th>
            </tr>
          </thead>

          <tbody>
            {batchJobs.map((job) => (
              <tr
                key={job.id}
                className="border-b border-slate-700 hover:bg-slate-700 transition"
              >
                <td className="py-4">{job.batch}</td>
                <td>{job.images}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      job.status === "Completed"
                        ? "bg-green-600"
                        : job.status === "Processing"
                        ? "bg-yellow-600"
                        : "bg-slate-600"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td>{job.accuracy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Batch;