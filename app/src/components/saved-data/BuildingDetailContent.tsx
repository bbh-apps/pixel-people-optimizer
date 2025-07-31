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
	BuildingListWithDetailRes,
	BuildingProfessionRes,
} from "../../types/models";

type BuildingDetailContentProps = {
	building: BuildingListWithDetailRes;
};

const BuildingDetailContent: React.FC<BuildingDetailContentProps> = ({
	building,
}) => {
	const { name, land_cost, max_cps, professions } = building;
	const theme = useMantineTheme();
	const colorScheme = useComputedColorScheme("light");
	const parentColor =
		colorScheme === "light" ? theme.colors.blue[0] : theme.colors.dark[4];

	const professionUnlockedColor = "blue";
	const professionUnlocksBldgColor =
		colorScheme === "light" ? theme.colors.orange[6] : theme.colors.orange[5];

	const getColor = (profession: BuildingProfessionRes) => {
		if (profession.is_unlocked) {
			return professionUnlockedColor;
		} else if (profession.is_unlock_bldg) {
			return professionUnlocksBldgColor;
		} else {
			return parentColor;
		}
	};

	return (
		<Stack>
			<Group>
				<Text size="sm">
					<Text span fw={700} inherit>
						Land Cost
					</Text>
					: {land_cost}
				</Text>
				<Text size="sm">
					<Text span fw={700} inherit>
						Max CPS
					</Text>
					: {max_cps}
				</Text>
			</Group>
			<Text size="sm">
				<Text span fw={700} inherit>
					{name}
				</Text>{" "}
				contains these professions:
			</Text>
			<Group>
				{professions.map((prof, idx) => (
					<Paper
						withBorder={colorScheme === "light"}
						bg={getColor(prof)}
						p={6}
						key={`${name}-formula-tooltip-${prof.name}-${idx}`}
					>
						<Text
							size="xs"
							fw={700}
							c={
								prof.is_unlock_bldg && !prof.is_unlocked
									? theme.colors.gray[9]
									: "var(--mantine-color-text)"
							}
						>
							{prof.name}
						</Text>
						<Text
							size="xs"
							c={
								prof.is_unlock_bldg && !prof.is_unlocked
									? theme.colors.gray[9]
									: "var(--mantine-color-text)"
							}
						>
							{prof.category}
						</Text>
					</Paper>
				))}
			</Group>
			<Stack gap={4}>
				<Text size="xs">
					<Text fw={700} span inherit c={professionUnlocksBldgColor}>
						Orange
					</Text>
					: this profession unlocks this building.
				</Text>
				<Text size="xs">
					<Text fw={700} span inherit c={professionUnlockedColor}>
						Blue
					</Text>
					: you have unlocked this profession.
				</Text>
			</Stack>
		</Stack>
	);
};

export default BuildingDetailContent;
