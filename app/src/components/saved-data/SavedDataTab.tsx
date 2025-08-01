import { Badge, Group, Skeleton, Tabs, Text } from "@mantine/core";
import { capitalize } from "lodash";
import React from "react";
import { useSelectedDataCount } from "../../hooks";
import type { GameDataType } from "../shared/GameDataForm";

type SavedDataTabProps = {
	type: GameDataType;
	icon: React.ReactNode;
	title: string;
};

const SavedDataTab: React.FC<SavedDataTabProps> = ({ type, icon, title }) => {
	const { getCountByType } = useSelectedDataCount();
	const count = getCountByType(type);
	const shortTitle = `My ${capitalize(type)}`;

	return (
		<Tabs.Tab value={type} leftSection={icon}>
			<Group>
				<Text size="md" visibleFrom="lg">
					{title}
				</Text>
				<Text size="sm" hiddenFrom="lg">
					{shortTitle}
				</Text>
				{count == null ? (
					<Skeleton h={12} w={12} radius="xs" />
				) : (
					<Badge
						color="blue"
						variant="light"
						styles={{ root: { borderRadius: "2px", padding: "4px" } }}
					>
						{count}
					</Badge>
				)}
			</Group>
		</Tabs.Tab>
	);
};

export default SavedDataTab;
