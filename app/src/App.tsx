import {
	AppShell,
	Container,
	Flex,
	List,
	Text,
	Title,
	useMatches,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { Suspense } from "react";
import BuildingsList from "./components/BuildingsList";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ProfessionsList from "./components/ProfessionsList";
import { Recommendations } from "./components/recommendations";
import { CheckboxListFormSkeleton } from "./components/shared";

export default function App() {
	const spacing = useMatches({
		base: "sm",
		lg: "xl",
	});

	const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
		offset: 70,
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
					<Flex direction="column" gap="xl">
						<Flex direction="column" gap="xs">
							<Title order={1}>Pixel People Optimizer</Title>
							<Text mt="md">
								Welcome! I made this free open-source tool to make splicing
								easier in one of my favorite games.
							</Text>
							<List
								type="ordered"
								size="sm"
								styles={{ root: { "--list-spacing": "0.5rem" } }}
							>
								<List.Item>
									Start by saving buildings and professions you have already
									unlocked.
								</List.Item>
								<List.Item>
									Click the "Optimize" button to see which new professions you
									can splice given the remaining land you have.
								</List.Item>
							</List>
						</Flex>
						<Flex
							gap="sm"
							wrap="wrap"
							direction={{ base: "column", sm: "row" }}
							justify="center"
						>
							<Suspense
								fallback={<CheckboxListFormSkeleton title="My Buildings" />}
							>
								<BuildingsList />
							</Suspense>
							<Suspense
								fallback={
									<CheckboxListFormSkeleton title="My Discovered Professions" />
								}
							>
								<ProfessionsList />
							</Suspense>
						</Flex>
						<Flex ref={targetRef}>
							<Recommendations scrollIntoView={scrollIntoView} />
						</Flex>
					</Flex>
				</Container>
			</AppShell.Main>
			<Footer />
		</AppShell>
	);
}
