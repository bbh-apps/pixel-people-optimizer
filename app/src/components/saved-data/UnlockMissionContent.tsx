import {
	Group,
	Paper,
	Stack,
	Text,
	useComputedColorScheme,
	useMantineTheme,
} from "@mantine/core";
import pluralize from "pluralize";
import React from "react";
import type {
	SavedProfessionFormulaRes,
	SavedProfessionMissionRes,
} from "../../types/models";

type UnlockMissionContentProps = {
	name: string;
	mission: SavedProfessionMissionRes[];
	formula: SavedProfessionFormulaRes[];
};

const UnlockMissionContent: React.FC<UnlockMissionContentProps> = ({
	name,
	mission,
	formula,
}) => {
	const theme = useMantineTheme();
	const colorScheme = useComputedColorScheme("light");
	const parentColor =
		colorScheme === "light" ? theme.colors.blue[0] : theme.colors.dark[4];
	const isRecipeUnlock =
		mission.length === 1 && mission.every((m) => m.is_recipe_unlock === true);

	return (
		<Stack gap="sm">
			<Stack gap={4}>
				<Text size="sm">
					Complete {pluralize("this", mission.length)} special{" "}
					{pluralize("mission", mission.length)}:
				</Text>
				<Text size="xs" fs="italic">
					{isRecipeUnlock
						? "This mission allows you to splice this profession even though you can see the formula here."
						: "This is required by part of the formula or by prerequisite professions."}
				</Text>
			</Stack>
			<Group>
				{mission.map((m) => (
					<Paper
						withBorder={colorScheme === "light"}
						bg={m.is_complete ? "blue" : parentColor}
						p={6}
						key={`unlock-prof-modal-${m.name}`}
					>
						<Text size="xs" fw={700}>
							{m.name}
						</Text>
						<Text size="xs">{m.is_complete ? "Complete" : "Incomplete"}</Text>
					</Paper>
				))}
			</Group>

			{formula.length > 0 && (
				<>
					<Text size="sm">
						<Text span fw={700} inherit>
							{name}
						</Text>{" "}
						is unlocked with:
					</Text>
					<Group>
						{formula.map((prof) => (
							<Paper
								withBorder={colorScheme === "light"}
								bg={prof.is_unlocked ? "blue" : parentColor}
								p={6}
								key={`unlock-prof-modal-${prof.name}`}
							>
								<Text size="xs" fw={700}>
									{prof.name}
								</Text>
								<Text size="xs">{prof.category}</Text>
							</Paper>
						))}
					</Group>
					<Text size="xs">
						<Text span c="blue" fw={700} inherit>
							Blue
						</Text>{" "}
						represents professions you already unlocked.
					</Text>
				</>
			)}
		</Stack>
	);
};

export default UnlockMissionContent;
