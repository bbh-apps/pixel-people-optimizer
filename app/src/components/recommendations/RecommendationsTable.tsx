import { Group, Table, Text, UnstyledButton } from "@mantine/core";
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

type RecommendationsTableProps = {
	recommendations: RecommendationRes[];
	sortBy: SortableKey;
	sortDirection: SortDirection;
	onClickSorting: (key: SortableKey) => void;
};

const RecommendationsTable: React.FC<RecommendationsTableProps> = ({
	recommendations,
	sortBy,
	sortDirection,
	onClickSorting,
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
					fw={sortBy === value ? 700 : 500}
					flex={1}
					c={sortBy === value ? "blue" : "white"}
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
		<Table visibleFrom="sm">
			<Table.Thead>
				<Table.Tr>{headers}</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{recommendations.map((rec) => (
					<Table.Tr key={rec.profession.name}>
						<Table.Td>{rec.profession.name}</Table.Td>
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
						<Table.Td>{rec.unlock_bldg?.name}</Table.Td>
						<Table.Td>{rec.score}</Table.Td>
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
};

export default RecommendationsTable;
