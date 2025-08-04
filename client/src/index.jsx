import React from "react";
import ReactDOM from "react-dom/client";
import AppLayout from "./layouts/AppLayout";
import axios from "axios";
import { NotificationProvider } from "./components/Notification";

axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <NotificationProvider>
    <AppLayout />
  </NotificationProvider>
);
