import { AppShell, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Route, Routes } from "react-router";
import FaqPage from "./components/FaqPage";
import Footer from "./components/Footer";
import Header from "./components/Header";
import NavBar from "./components/NavBar";
import PixelPeopleOptimizer from "./components/PixelPeopleOptimizer";

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
				<NavBar />
			</AppShell.Navbar>
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
