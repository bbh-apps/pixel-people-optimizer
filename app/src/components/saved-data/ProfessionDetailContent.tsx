import {
	Group,
	Paper,
	Stack,
	Text,
	useComputedColorScheme,
	useMantineTheme,
} from "@mantine/core";
import React from "react";
import type { SavedProfessionFormulaRes } from "../../types/models";

type ProfessionDetailContentProps = {
	name: string;
	formula: SavedProfessionFormulaRes[];
};

const ProfessionDetailContent: React.FC<ProfessionDetailContentProps> = ({
	name,
	formula,
}) => {
	const theme = useMantineTheme();
	const colorScheme = useComputedColorScheme("light");
	const parentColor =
		colorScheme === "light" ? theme.colors.blue[0] : theme.colors.dark[4];

	return (
		<Stack>
			<Text size="sm">
				<Text span fw={700} inherit>
					{name}
				</Text>{" "}
				is unlocked with:
			</Text>
			<Group>
				{formula.map((prof, idx) => (
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
