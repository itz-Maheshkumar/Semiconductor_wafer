import { useEffect } from "react";

function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-6"></div>

      <h1 className="text-4xl font-bold">
        Semiconductor
      </h1>

      <p className="text-slate-400 mt-2">
        Wafer Defect Detection System
      </p>

      <p className="text-sm text-slate-500 mt-6">
        Loading...
      </p>
    </div>
  );
}

export default SplashScreen;