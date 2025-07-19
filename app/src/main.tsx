import { createTheme, MantineProvider } from "@mantine/core";
import { MantineEmotionProvider } from "@mantine/emotion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";

import "@mantine/core/styles.css";

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
		<MantineProvider defaultColorScheme="auto" theme={theme}>
			<MantineEmotionProvider>
				<AuthProvider>
					<QueryClientProvider client={queryClient}>
						<App />
						<Analytics />
					</QueryClientProvider>
				</AuthProvider>
			</MantineEmotionProvider>
		</MantineProvider>
	</React.StrictMode>
);
