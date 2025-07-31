import { Tabs } from "@mantine/core";
import React, { Suspense, useState } from "react";
import { CheckboxListFormSkeleton } from "../shared";
import type { GameDataType } from "../shared/GameDataForm";
import BuildingsList from "./BuildingsList";
import MissionsList from "./MissionsList";
import ProfessionsList from "./ProfessionsList";
import type { SavedDataItem } from "./SavedData";
import SavedDataTab from "./SavedDataTab";

type SavedDataTabsProps = {
	items: SavedDataItem[];
};

const SavedDataTabs: React.FC<SavedDataTabsProps> = ({ items }) => {
	const [tab, setTab] = useState<GameDataType | null>("buildings");

	const getListToRender = (value: GameDataType) => {
		switch (value) {
			case "buildings":
				return <BuildingsList />;
			case "professions":
				return <ProfessionsList />;
			case "missions":
				return <MissionsList />;
			default:
				return null;
		}
	};

	return (
		<Tabs
			visibleFrom="sm"
			variant="outline"
			value={tab}
			onChange={(v) => setTab(v as GameDataType | null)}
			styles={{
				panel: {
					borderColor: "var(--mantine-color-dark-4)",
					borderStyle: "solid",
					borderWidth: "1px",
					borderTopStyle: "none",
					borderBottomLeftRadius: "var(--mantine-radius-sm)",
					borderBottomRightRadius: "var(--mantine-radius-sm)",
					paddingTop: "var(--mantine-spacing-md)",
					paddingBottom: "var(--mantine-spacing-md)",
				},
			}}
		>
			<Tabs.List>
				{items.map((item) => (
					<SavedDataTab
						key={`${item.value}-tab`}
						type={item.value}
						icon={item.icon}
						title={item.title}
					/>
				))}
			</Tabs.List>

			{items.map((item) => (
				<Tabs.Panel value={item.value} key={`${item.value}-tab-panel`}>
					<Suspense
						key="saved-data-tabs-suspense"
						fallback={<CheckboxListFormSkeleton type={item.value} />}
					>
						{getListToRender(item.value)}
					</Suspense>
				</Tabs.Panel>
			))}
		</Tabs>
	);
};

export default SavedDataTabs;
