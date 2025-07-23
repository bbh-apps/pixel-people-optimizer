import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import { MantineEmotionProvider } from "@mantine/emotion";
import { Notifications } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const queryClient = new QueryClient();
const theme = createTheme({
	breakpoints: {
		xs: "30em",
		sm: "43.75em",
		md: "64em",
		lg: "74em",
		xl: "90em",
	},
});

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<BrowserRouter>
			<QueryClientProvider client={queryClient}>
				<ColorSchemeScript defaultColorScheme="auto" />
				<MantineProvider defaultColorScheme="auto" theme={theme}>
					<MantineEmotionProvider>
						<AuthProvider>
							<Notifications />
							<App />
							<Analytics />
						</AuthProvider>
					</MantineEmotionProvider>
				</MantineProvider>
			</QueryClientProvider>
		</BrowserRouter>
	</React.StrictMode>
);
