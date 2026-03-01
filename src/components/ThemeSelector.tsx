"use client";

import * as React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSelector() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-9 h-9" />;

  const options = [
    { id: "light", icon: Sun, label: "Sacred Light" },
    { id: "dark", icon: Moon, label: "Marian Dark" },
    { id: "system", icon: Monitor, label: "System" },
  ];

  return (
    <div className="flex flex-col gap-1 p-1 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
      <div className="grid grid-cols-3 gap-1">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = theme === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={`flex flex-col items-center justify-center py-2 rounded-lg transition-all ${
                isActive 
                  ? "bg-white dark:bg-white/10 text-sacred-gold shadow-sm ring-1 ring-black/5" 
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              }`}
              title={opt.label}
            >
              <Icon size={14} className={isActive ? "animate-in zoom-in duration-300" : ""} />
              <span className="text-[8px] font-bold uppercase mt-1 tracking-tighter">{opt.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
