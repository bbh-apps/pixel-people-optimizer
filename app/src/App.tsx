import { AppShell, Container, Group, Text, Title } from "@mantine/core";

export default function App() {
	return (
		<AppShell header={{ height: { base: 60, md: 70, lg: 80 } }} padding="md">
			<AppShell.Header>
				<Group h="100%" px="md">
					<Title order={4}>Pixel People Optimizer</Title>
				</Group>
			</AppShell.Header>
			<AppShell.Main>
				<Container size="sm" mt="xl">
					<Title order={1}>Pixel People Optimizer</Title>
					<Text mt="md">
						Welcome! Start by uploading your save data or adding your discovered
						professions.
					</Text>
				</Container>
			</AppShell.Main>
		</AppShell>
	);
}
