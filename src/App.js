import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HealthReminderApp() {
  const [permission, setPermission] = useState(Notification.permission);
  const [page, setPage] = useState("home");
  const [settings, setSettings] = useState({
    water: true,
    move: true,
    breathe: true,
    pause: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const proStatus = localStorage.getItem('isProUser');
    if (proStatus === 'true') setIsPro(true);

    const savedSettings = localStorage.getItem('healthReminderSettings');
    if (savedSettings) setSettings(JSON.parse(savedSettings));

    const darkModeStatus = localStorage.getItem('darkMode');
    if (darkModeStatus === 'true') setDarkMode(true);
  }, []);

  useEffect(() => {
    if (permission === "granted") {
      const interval = setInterval(() => {
        const messages = [];
        if (settings.water) messages.push("È ora di bere acqua! 💧");
        if (settings.move) messages.push("Muoviti un po'! 🚶‍♀️");
        if (settings.breathe) messages.push("Respira profondamente! 🧘‍♂️");
        if (settings.pause) messages.push("Fai una pausa! ☕");

        if (messages.length > 0) {
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          new Notification("Salute e Benessere", {
            body: randomMessage,
            icon: "/icon-192x192.png",
            silent: false
          });
        }
      }, 60 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [permission, settings]);

  const requestPermission = () => {
    Notification.requestPermission().then((perm) => {
      setPermission(perm);
    });
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('healthReminderSettings', JSON.stringify(newSettings));
  };

  const toggleDarkMode = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    localStorage.setItem('darkMode', newDark);
  };

  const upgradeToPro = () => {
    setIsPro(true);
    localStorage.setItem('isProUser', 'true');
  };

  const containerClass = darkMode
    ? "min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4"
    : "min-h-screen flex flex-col items-center justify-center bg-blue-100 text-black p-4";

  if (page === "settings") {
    return (
      <div className={containerClass}>
        <motion.h1 className="text-3xl font-bold mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Impostazioni ⚙️
        </motion.h1>
        <div className="flex flex-col gap-4 mb-4">
          {Object.keys(settings).map((key) => (
            <div key={key} className="flex justify-between">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => saveSettings({ ...settings, [key]: e.target.checked })}
              />
            </div>
          ))}
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setPage("home")}>
          Torna alla Home
        </button>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <motion.h1 className="text-3xl font-bold mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        Salute e Benessere 🌱
      </motion.h1>

      <div className="flex flex-col gap-4 mb-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={permission !== "granted" ? requestPermission : undefined}
        >
          {permission !== "granted" ? "Attiva Notifiche" : "Notifiche Attive ✅"}
        </button>

        <button className="bg-purple-500 text-white px-4 py-2 rounded" onClick={() => setPage("settings")}>
          Impostazioni
        </button>

        <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={toggleDarkMode}>
          {darkMode ? "Modalità Chiara ☀️" : "Modalità Scura 🌙"}
        </button>

        {!isPro && (
          <button className="bg-yellow-400 text-black px-4 py-2 rounded" onClick={upgradeToPro}>
            Passa a PRO (No Ads)
          </button>
        )}
      </div>

      {!isPro && (
        <div className="bg-gray-200 p-4 rounded text-center text-gray-600">
          Banner Pubblicitario (solo versione gratuita)
        </div>
      )}
    </div>
  );
}
