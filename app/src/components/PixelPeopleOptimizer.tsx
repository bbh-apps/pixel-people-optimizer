import { Flex, List, Stack, Text, Title } from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { Suspense } from "react";
import BuildingsList from "./BuildingsList";
import ProfessionsList from "./ProfessionsList";
import { Recommendations } from "./recommendations";
import { CheckboxListFormSkeleton } from "./shared";

const PixelPeopleOptimizer = () => {
	const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
		offset: 70,
	});

	return (
		<Flex direction="column" gap="xl">
			<Stack gap="xs">
				<Title order={1}>Pixel People Optimizer</Title>
				<Text>
					Welcome! I made this free open-source tool to make splicing easier in
					one of my favorite games.
				</Text>
				<List
					type="ordered"
					size="sm"
					styles={{ root: { "--list-spacing": "0.5rem" } }}
				>
					<List.Item>
						By default, the professions and buildings that you start the game
						with will be pre-selected if you do not have an account or are not
						signed in. Clicking "Save" will prompt you to sign up/in.
					</List.Item>
					<List.Item>
						You can also start by saving buildings and professions you have
						already unlocked. If this is your first time, it will prompt you to
						create an account to save your game data.
					</List.Item>
					<List.Item>
						After signing in, click the "Optimize" button to see which new
						professions you can splice given the remaining land you have.
					</List.Item>
				</List>
			</Stack>
			<Flex
				gap="sm"
				wrap="wrap"
				direction={{ base: "column", sm: "row" }}
				justify="center"
			>
				<Suspense fallback={<CheckboxListFormSkeleton title="My Buildings" />}>
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
	);
};

export default PixelPeopleOptimizer;
