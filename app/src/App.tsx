import { AppShell, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ErrorBoundary } from "react-error-boundary";
import { Route, Routes } from "react-router";
import FaqPage from "./components/FaqPage";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import PixelPeopleOptimizer from "./components/PixelPeopleOptimizer";
import ErrorBoundaryAlert from "./components/shared/ErrorBoundaryAlert";
import VisualizerPage from "./components/visualizer/VisualizerPage";
import PublicDataProvider from "./context/PublicDataProvider";

export default function App() {
	const [isNavBarOpen, navBar] = useDisclosure();
	const spacing = { base: "xs", lg: "lg" };

	return (
		<AppShell
			header={{ height: { base: 60, md: 70, lg: 80 } }}
			navbar={{
				width: { xs: 300, sm: 200 },
				breakpoint: "sm",
				collapsed: { mobile: !isNavBarOpen },
			}}
			padding={spacing}
		>
			<AppShell.Header>
				<Header isNavBarOpen={isNavBarOpen} navBarToggle={navBar.toggle} />
			</AppShell.Header>
			<AppShell.Navbar p="md">
				<NavBar toggle={navBar.toggle} />
			</AppShell.Navbar>
			<AppShell.Main>
				<ErrorBoundary
					fallbackRender={({ error }) => (
						<ErrorBoundaryAlert message={error.message} />
					)}
				>
					<PublicDataProvider>
						<Container size="md" py={spacing} w="100%">
							<Routes>
								<Route path="/" element={<PixelPeopleOptimizer />} />
								<Route path="/visualizer" element={<VisualizerPage />} />
								<Route path="/faq" element={<FaqPage />} />
							</Routes>
						</Container>
					</PublicDataProvider>
				</ErrorBoundary>
			</AppShell.Main>
			<Footer />
		</AppShell>
	);
}
