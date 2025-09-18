import {
	Alert,
	Group,
	Paper,
	Stack,
	Text,
	useComputedColorScheme,
	useMantineTheme,
} from "@mantine/core";
import pluralize from "pluralize";
import React from "react";
import type { ProfessionListWithDetailRes } from "../../types/models";

type ProfessionDetailContentProps = {
	profession: ProfessionListWithDetailRes;
};

const ProfessionDetailContent: React.FC<ProfessionDetailContentProps> = ({
	profession,
}) => {
	const theme = useMantineTheme();
	const colorScheme = useComputedColorScheme("light");
	const parentColor =
		colorScheme === "light" ? theme.colors.blue[0] : theme.colors.dark[4];

	const { name, formula, mission, unlock_bldg } = profession;

	return (
		<Stack gap="sm">
			{mission != null && (
				<Alert styles={{ root: { padding: "8px" } }}>
					<Text size="xs">
						You have completed {pluralize("this", mission.length)} special{" "}
						{pluralize("mission", mission.length)}:
					</Text>
					<Text size="xs" fs="italic">
						{mission.map((m) => m.name).join(", ")}
					</Text>
				</Alert>
			)}
			{unlock_bldg && (
				<Text size="sm">
					<Text span fw={700} inherit>
						{name}
					</Text>{" "}
					unlocks the building: {unlock_bldg}
				</Text>
			)}
			<Text size="sm">
				<Text span fw={700} inherit>
					{name}
				</Text>{" "}
				is unlocked with:
			</Text>
			<Group>
				{formula &&
					formula.map((prof, idx) => (
						<Paper
							withBorder={colorScheme === "light"}
							bg={prof.is_unlocked ? "blue" : parentColor}
							p={6}
							key={`${name}-formula-tooltip-${prof.name}-${idx}`}
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
		</Stack>
	);
};

export default ProfessionDetailContent;
