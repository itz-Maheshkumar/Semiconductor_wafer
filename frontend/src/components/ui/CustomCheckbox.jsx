import { Check } from "lucide-react";

function CustomCheckbox({ label, checked, onChange, name }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange({ target: { name, type: "checkbox", checked: !checked } })}
        className={`relative w-6 h-6 rounded border-2 transition-all flex items-center justify-center ${
          checked
            ? "bg-blue-600 border-blue-600"
            : "border-slate-600 hover:border-slate-500"
        }`}
      >
        {checked && <Check size={16} className="text-white" />}
      </button>
      <label className="cursor-pointer select-none text-slate-200">{label}</label>
    </div>
  );
}

export default CustomCheckbox;
