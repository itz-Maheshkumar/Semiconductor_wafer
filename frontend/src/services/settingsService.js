import api from "./api";

export const getSettings = async () => {
  try {
    const user = await api.get("/auth/me");
    return {
      name: user.data.name,
      email: user.data.email,
      notifications: localStorage.getItem("notifications") !== "false",
      darkMode: localStorage.getItem("darkMode") !== "false",
      autoSave: localStorage.getItem("autoSave") !== "false",
      model: localStorage.getItem("model") || "CNN v2.0",
    };
  } catch (err) {
    console.error("Failed to load settings:", err);
    return {
      name: localStorage.getItem("userName") || "User",
      email: localStorage.getItem("userEmail") || "",
      notifications: true,
      darkMode: true,
      autoSave: true,
      model: "CNN v2.0",
    };
  }
};

export const updateProfile = async (name, email, password) => {
  const payload = {};
  if (name) payload.name = name;
  if (email) payload.email = email;
  if (password) payload.password = password;

  const response = await api.put("/auth/me", payload);
  localStorage.setItem("userName", response.data.name);
  localStorage.setItem("userEmail", response.data.email);
  return response.data;
};

export const updatePreferences = (preferences) => {
  if (preferences.notifications !== undefined) {
    localStorage.setItem("notifications", preferences.notifications);
  }
  if (preferences.darkMode !== undefined) {
    localStorage.setItem("darkMode", preferences.darkMode);
  }
  if (preferences.autoSave !== undefined) {
    localStorage.setItem("autoSave", preferences.autoSave);
  }
  if (preferences.model) {
    localStorage.setItem("model", preferences.model);
  }
};
