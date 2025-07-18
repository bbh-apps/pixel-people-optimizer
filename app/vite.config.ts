import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			"/auth": {
				target: "http://localhost:8000",
				changeOrigin: true,
			},
			"/api": {
				target: "http://localhost:8000",
				changeOrigin: true,
			},
		},
	},
});
