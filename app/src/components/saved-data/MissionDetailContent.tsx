import {
	Group,
	Paper,
	Stack,
	Text,
	useComputedColorScheme,
	useMantineTheme,
} from "@mantine/core";
import React from "react";
import type { MissionListWithDetailRes } from "../../types/models";

type MissionDetailContentProps = {
	mission: MissionListWithDetailRes;
};

const MissionDetailContent: React.FC<MissionDetailContentProps> = ({
	mission,
}) => {
	const theme = useMantineTheme();
	const colorScheme = useComputedColorScheme("light");
	const parentColor =
		colorScheme === "light" ? theme.colors.blue[0] : theme.colors.dark[4];

	return (
		<Stack>
			<Text size="sm">This mission requires the following things:</Text>
			<Text size="xs">{mission.cost}</Text>

			<Text size="sm">Completing this mission will unlock:</Text>

			<Group>
				{mission.professions.map((prof) => (
					<Paper
						withBorder
						bg={parentColor}
						p={6}
						key={`unlock-prof-tooltip-${prof.name}`}
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

export default MissionDetailContent;
