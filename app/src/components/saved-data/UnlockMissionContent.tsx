import {
	Group,
	Paper,
	Stack,
	Text,
	useComputedColorScheme,
	useMantineTheme,
} from "@mantine/core";
import React from "react";
import type {
	SavedProfessionFormulaRes,
	SavedProfessionMissionRes,
} from "../../types/models";

type UnlockMissionContentProps = {
	mission: SavedProfessionMissionRes;
	formula: SavedProfessionFormulaRes[];
};

const UnlockMissionContent: React.FC<UnlockMissionContentProps> = ({
	mission,
	formula,
}) => {
	const theme = useMantineTheme();
	const colorScheme = useComputedColorScheme("light");
	const parentColor =
		colorScheme === "light" ? theme.colors.blue[0] : theme.colors.dark[4];

	return (
		<Stack>
			<Stack gap={2}>
				<Text size="sm">Must complete the special mission:</Text>
				<Text size="sm">{mission.name ?? "n/a"}</Text>
			</Stack>

			{formula.length > 0 && (
				<Text size="xs">
					<Text span c="blue" fw={700} inherit>
						Blue
					</Text>{" "}
					represents professions you already unlocked.
				</Text>
			)}

			{formula.length > 0 && (
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
			)}
		</Stack>
	);
};

export default UnlockMissionContent;
