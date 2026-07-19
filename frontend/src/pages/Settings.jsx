import { useEffect, useState } from "react";
import { getSettings, updateProfile, updatePreferences } from "../services/settingsService";
import CustomCheckbox from "../components/ui/CustomCheckbox";
import { ChevronDown } from "lucide-react";

function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    notifications: true,
    darkMode: true,
    autoSave: true,
    model: "CNN v2.0",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
        setFormData(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage("");
    try {
      await updateProfile(formData.name, formData.email, formData.password);
      setMessage("Profile updated successfully!");
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setMessage(err.response?.data?.error?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = () => {
    updatePreferences({
      notifications: formData.notifications,
      darkMode: formData.darkMode,
      autoSave: formData.autoSave,
      model: formData.model,
    });
    setMessage("Preferences saved successfully!");
  };

  if (loading) {
    return <div className="p-8 text-center">Loading settings...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-400">
          Configure your profile and system preferences.
        </p>
      </div>

      {message && (
        <div className="bg-green-600 text-white p-4 rounded-lg">
          {message}
        </div>
      )}

      {/* Profile Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold">Profile Settings</h2>

        <div>
          <label className="block mb-2 text-sm">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full bg-slate-700 p-3 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full bg-slate-700 p-3 rounded-lg text-white"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm">New Password (optional)</label>
          <input
            type="password"
            name="password"
            placeholder="Leave empty to keep current password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full bg-slate-700 p-3 rounded-lg text-white"
          />
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>

      {/* Preferences Section */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold">Preferences</h2>

        <div className="space-y-4">
          <CustomCheckbox
            label="Enable Notifications"
            name="notifications"
            checked={formData.notifications}
            onChange={handleInputChange}
          />

          <CustomCheckbox
            label="Dark Mode"
            name="darkMode"
            checked={formData.darkMode}
            onChange={handleInputChange}
          />

          <CustomCheckbox
            label="Auto-save Reports"
            name="autoSave"
            checked={formData.autoSave}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="block mb-3 text-sm font-semibold">AI Model Version</label>
          <div className="relative">
            <select
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white appearance-none focus:outline-none focus:border-blue-500 hover:border-slate-500 transition"
            >
              <option>CNN v1.0</option>
              <option>CNN v2.0</option>
              <option>YOLOv8</option>
              <option>ResNet50</option>
            </select>
            <ChevronDown
              size={20}
              className="absolute right-3 top-3 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold transition"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}

export default Settings;