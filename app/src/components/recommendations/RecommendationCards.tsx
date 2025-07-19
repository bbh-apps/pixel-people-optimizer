import {
	ActionIcon,
	Badge,
	Card,
	Group,
	Paper,
	Select,
	Stack,
	Text,
	useMantineColorScheme,
	useMantineTheme,
} from "@mantine/core";

import { SortAscendingIcon, SortDescendingIcon } from "@phosphor-icons/react";
import type React from "react";
import {
	recommendationKeyToLabel,
	type SortableKey,
	type SortDirection,
} from "../../hooks";
import type { RecommendationRes } from "../../types/models";
import ViewBuildingProfessions from "./ViewBuildingProfessions";
import ViewUnlockedProfessions from "./ViewUnlockedProfessions";

type RecommendationsCardProps = {
	recommendations: RecommendationRes[];
	sortBy: SortableKey;
	sortDirection: SortDirection;
	onClickSorting: (key: SortableKey) => void;
};

const RecommendationCards: React.FC<RecommendationsCardProps> = ({
	recommendations,
	sortBy,
	sortDirection,
	onClickSorting,
}) => {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const parentColor =
		colorScheme === "light" ? theme.colors.blue[0] : theme.colors.dark[4];

	const Icon = sortDirection === "asc" ? SortAscendingIcon : SortDescendingIcon;

	return (
		<Stack hiddenFrom="sm" w="100%">
			<Group justify="space-between">
				<Select
					data={recommendationKeyToLabel}
					flex={1}
					allowDeselect={false}
					value={sortBy}
					onChange={(k) => k && onClickSorting(k as SortableKey)}
				/>
				<ActionIcon>
					<Icon onClick={() => onClickSorting(sortBy)} />
				</ActionIcon>
			</Group>
			{recommendations.map((rec) => (
				<Card key={rec.profession.name} withBorder w="100%">
					<Stack>
						<Group justify="space-between">
							<Stack flex={1} gap={4}>
								<Text fw={700}>{rec.profession.name}</Text>
								<Text size="xs">
									Unlocks: <ViewBuildingProfessions recommendation={rec} />
								</Text>
								<Text size="xs">
									Unlocks: <ViewUnlockedProfessions recommendation={rec} />
								</Text>
							</Stack>

							<Group gap={2}>
								<Stack align="center" gap={4} w="50px">
									<Text size="xs" ta="center" fw={500}>
										Land Cost
									</Text>
									<Badge>{rec.extra_land_needed}</Badge>
								</Stack>
								<Stack align="center" gap={4} w="50px">
									<Text size="xs" ta="center" fw={500}>
										Max CPS
									</Text>
									<Badge>{rec.score}</Badge>
								</Stack>
							</Group>
						</Group>
						<Group gap="xs">
							<Paper withBorder bg={parentColor} p={6}>
								<Text size="xs" fw={700}>
									{rec.parent1?.name}
								</Text>
								<Text size="xs">{rec.parent1?.category}</Text>
							</Paper>
							<Paper withBorder bg={parentColor} p={6}>
								<Text size="xs" fw={700}>
									{rec.parent2?.name}
								</Text>
								<Text size="xs">{rec.parent2?.category}</Text>
							</Paper>
						</Group>
					</Stack>
				</Card>
			))}
		</Stack>
	);
};

export default RecommendationCards;
