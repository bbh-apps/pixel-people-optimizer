import { Group, ScrollArea, Table, Text, UnstyledButton } from "@mantine/core";
import {
	CaretDownIcon,
	CaretUpDownIcon,
	CaretUpIcon,
} from "@phosphor-icons/react";
import React from "react";
import {
	recommendationKeyToLabel,
	type SortableKey,
	type SortDirection,
} from "../../hooks";
import type { RecommendationRes } from "../../types/models";
import SaveRecommendationButton from "./SaveRecommendationButton";
import ViewBuildingProfessions from "./ViewBuildingProfessions";
import ViewUnlockedProfessions from "./ViewUnlockedProfessions";

type RecommendationsTableProps = {
	recommendations: RecommendationRes[];
	sortBy: SortableKey;
	sortDirection: SortDirection;
	onClickSorting: (key: SortableKey) => void;
	refetch: () => void;
	onConsumeLandRemaining: (landCost: number) => void;
};

const RecommendationsTable: React.FC<RecommendationsTableProps> = ({
	recommendations,
	sortBy,
	sortDirection,
	onClickSorting,
	refetch,
	onConsumeLandRemaining,
}) => {
	const getIcon = (header: SortableKey) => {
		const sorted = sortBy === header;
		const Icon = sorted
			? sortDirection === "asc"
				? CaretDownIcon
				: CaretUpIcon
			: CaretUpDownIcon;
		return <Icon size={12} />;
	};

	const headers = recommendationKeyToLabel.map(({ label, value }) => (
		<Table.Th key={value}>
			<Group gap="xs" wrap="nowrap">
				<Text
					size="sm"
					fw={700}
					flex={1}
					c={sortBy === value ? "blue" : "var(--mantine-color-text)"}
				>
					{label}
				</Text>
				<UnstyledButton onClick={() => onClickSorting(value as SortableKey)}>
					{getIcon(value as SortableKey)}
				</UnstyledButton>
			</Group>
		</Table.Th>
	));

	return (
		<ScrollArea w="100%" pb="md" visibleFrom="sm">
			<Table>
				<Table.Thead>
					<Table.Tr>
						{headers}
						<Table.Th>Actions</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{recommendations.map((rec) => (
						<Table.Tr key={rec.profession.name}>
							<Table.Td>
								<Text size="sm" fw={500}>
									{rec.profession.name}
								</Text>
								<Text size="xs">{rec.profession.category}</Text>
							</Table.Td>
							<Table.Td>
								<Text size="sm" fw={500}>
									{rec.parent1?.name}
								</Text>
								<Text size="xs">{rec.parent1?.category}</Text>
							</Table.Td>
							<Table.Td>
								<Text size="sm" fw={500}>
									{rec.parent2?.name}
								</Text>
								<Text size="xs">{rec.parent2?.category}</Text>
							</Table.Td>
							<Table.Td>{rec.extra_land_needed}</Table.Td>
							<Table.Td>
								<ViewBuildingProfessions recommendation={rec} />
							</Table.Td>
							<Table.Td>
								<ViewUnlockedProfessions recommendation={rec} />
							</Table.Td>
							<Table.Td>{rec.max_cps}</Table.Td>
							<Table.Td>
								<SaveRecommendationButton
									recommendation={rec}
									refetch={refetch}
									onConsumeLandRemaining={onConsumeLandRemaining}
								/>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		</ScrollArea>
	);
};

export default RecommendationsTable;
