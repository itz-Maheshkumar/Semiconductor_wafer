import { historyData } from "../mock/historyData";

function History() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Inspection History</h1>
        <p className="text-slate-400 mt-2">
          Review previous wafer inspection results.
        </p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-900">
            <tr>
              <th className="p-4 text-left">Wafer ID</th>
              <th className="text-left">Date</th>
              <th className="text-left">Defect</th>
              <th className="text-left">Confidence</th>
              <th className="text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {historyData.map((item) => (
              <tr
                key={item.id}
                className="border-t border-slate-700 hover:bg-slate-700 transition"
              >
                <td className="p-4 font-medium">{item.id}</td>
                <td>{item.date}</td>
                <td>{item.defect}</td>
                <td>{item.confidence}</td>
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "Passed"
                        ? "bg-green-600"
                        : item.status === "Rejected"
                        ? "bg-red-600"
                        : "bg-yellow-600"
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
    </div>
  );
}

export default History;