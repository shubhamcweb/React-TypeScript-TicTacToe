import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const rootElement: HTMLElement | null = document.getElementById("react-root");

if (!rootElement) throw new Error("rootElement not found!");

const root = createRoot(rootElement);

root.render(
	<StrictMode>
		<App />
	</StrictMode>
);
