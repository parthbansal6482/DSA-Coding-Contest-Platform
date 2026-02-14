import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="929855839228-nqt4uc7sjuh1bbmsdejjq5hcelbv0gcb.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);