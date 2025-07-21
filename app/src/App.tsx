import { AppShell, Container, useMatches } from "@mantine/core";
import { Route, Routes } from "react-router";
import FaqPage from "./components/FaqPage";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PixelPeopleOptimizer from "./components/PixelPeopleOptimizer";

export default function App() {
	const spacing = useMatches({
		base: "sm",
		lg: "xl",
	});

	return (
		<AppShell
			header={{ height: { base: 60, md: 70, lg: 80 } }}
			padding={spacing}
		>
			<AppShell.Header>
				<Header />
			</AppShell.Header>
			<AppShell.Main>
				<Container size="md" py={spacing}>
					<Routes>
						<Route path="/" element={<PixelPeopleOptimizer />} />
						<Route path="/faq" element={<FaqPage />} />
					</Routes>
				</Container>
			</AppShell.Main>
			<Footer />
		</AppShell>
	);
}
