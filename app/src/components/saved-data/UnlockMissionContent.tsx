import {
	Group,
	Paper,
	Stack,
	Text,
	useComputedColorScheme,
	useMantineTheme,
} from "@mantine/core";
import React from "react";
import type { MissionListRes, ProfessionListRes } from "../../types/models";

type Formula = ProfessionListRes & { isUnlocked: boolean };

type UnlockMissionContentProps = {
	mission: MissionListRes;
	formula: Formula[];
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
			<Text size="sm">
				Must complete the special mission first: {mission.name ?? "n/a"}
			</Text>

			<Text size="xs">
				<Text span c="blue" inherit>
					Blue
				</Text>{" "}
				represents professions you already unlocked.
			</Text>

			<Group>
				{formula.map((prof) => (
					<Paper
						withBorder
						bg={prof.isUnlocked ? "blue" : parentColor}
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
		</Stack>
	);
};

export default UnlockMissionContent;
