import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const showMessage = (msg, sev = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <NotificationContext.Provider value={{ showMessage }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={1000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
