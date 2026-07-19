function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-400">
          Configure system preferences.
        </p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">

        <div className="flex justify-between items-center">
          <span>Enable Notifications</span>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="flex justify-between items-center">
          <span>Dark Mode</span>
          <input type="checkbox" defaultChecked />
        </div>

        <div className="flex justify-between items-center">
          <span>Auto-save Reports</span>
          <input type="checkbox" defaultChecked />
        </div>

        <div>
          <label className="block mb-2">
            AI Model Version
          </label>

          <select className="bg-slate-700 p-3 rounded-lg w-full">
            <option>CNN v1.0</option>
            <option>CNN v2.0</option>
            <option>YOLOv8</option>
            <option>ResNet50</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default Settings;