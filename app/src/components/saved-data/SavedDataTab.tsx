import { Badge, Group, Tabs, Text } from "@mantine/core";
import React from "react";
import type { GameDataType } from "../shared/GameDataForm";

type SavedDataTabProps = {
	type: GameDataType;
	icon: React.ReactNode;
	title: string;
	count: number;
};

const SavedDataTab: React.FC<SavedDataTabProps> = ({
	type,
	icon,
	title,
	count,
}) => {
	return (
		<Tabs.Tab value={type} leftSection={icon}>
			<Group>
				<Text>{title}</Text>
				<Badge
					color="blue"
					variant="light"
					styles={{ root: { borderRadius: "2px", padding: "4px" } }}
				>
					{count}
				</Badge>
			</Group>
		</Tabs.Tab>
	);
};

export default SavedDataTab;
