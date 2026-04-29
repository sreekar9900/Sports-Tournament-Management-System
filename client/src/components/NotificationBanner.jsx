import React from "react";
import { useNotification } from "../context/NotificationContext";

const NotificationBanner = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {notifications.map((note) => (
        <div
          key={note.id}
          className={`px-4 py-3 rounded shadow-lg flex justify-between items-center min-w-[300px] transform transition-all duration-300 ${
            note.type === "success" ? "bg-emerald-600 text-white" : "bg-blue-600 text-white"
          }`}
        >
          <p className="text-sm font-semibold">{note.message}</p>
          <button
            title="Dismiss"
            onClick={() => removeNotification(note.id)}
            className="ml-4 text-white/70 hover:text-white"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationBanner;
