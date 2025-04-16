import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add Remix Icon stylesheet
const remixIconLink = document.createElement("link");
remixIconLink.href = "https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css";
remixIconLink.rel = "stylesheet";
document.head.appendChild(remixIconLink);

// Add Inter font
const fontLink = document.createElement("link");
fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

// Set document title
document.title = "Real Estate Wholesaling CRM";

createRoot(document.getElementById("root")!).render(<App />);
