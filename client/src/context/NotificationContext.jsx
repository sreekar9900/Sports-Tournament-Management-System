import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const defaultServerUrl = "http://localhost:5000";
    // Usually VITE_API_URL is http://localhost:5000/api
    const url = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace("/api", "") : defaultServerUrl;
    
    const newSocket = io(url);
    setSocket(newSocket);

    newSocket.on("tournament_created", (data) => {
      addNotification({ id: Date.now() + Math.random(), message: data.message, type: "info" });
    });

    newSocket.on("match_updated", (data) => {
      addNotification({ id: Date.now() + Math.random(), message: data.message, type: "success" });
    });

    return () => newSocket.close();
  }, []);

  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev].slice(0, 4));
    setTimeout(() => {
       removeNotification(notification.id);
    }, 6000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notifications, removeNotification, socket }}>
      {children}
    </NotificationContext.Provider>
  );
};
