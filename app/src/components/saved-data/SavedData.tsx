import { Tabs } from "@mantine/core";
import {
	BuildingOfficeIcon,
	PersonIcon,
	RocketLaunchIcon,
} from "@phosphor-icons/react";
import { Suspense, useState } from "react";
import { useSelectedDataCount } from "../../hooks";
import { CheckboxListFormSkeleton } from "../shared";
import type { GameDataType } from "../shared/GameDataForm";
import BuildingsList from "./BuildingsList";
import MissionsList from "./MissionsList";
import ProfessionsList from "./ProfessionsList";
import SavedDataTab from "./SavedDataTab";

const SavedData = () => {
	const [tab, setTab] = useState<GameDataType | null>("buildings");
	const { buildingCount, professionCount, missionCount } =
		useSelectedDataCount();

	return (
		<Tabs
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
				<SavedDataTab
					type="buildings"
					icon={<BuildingOfficeIcon size={12} />}
					title="My Buildings"
					count={buildingCount}
				/>
				<SavedDataTab
					type="professions"
					icon={<PersonIcon size={12} />}
					title="My Discovered Professions"
					count={professionCount}
				/>
				<SavedDataTab
					type="missions"
					icon={<RocketLaunchIcon size={12} />}
					title="My Completed Missions"
					count={missionCount}
				/>
			</Tabs.List>

			<Tabs.Panel value="buildings">
				<Suspense fallback={<CheckboxListFormSkeleton type="buildings" />}>
					<BuildingsList />
				</Suspense>
			</Tabs.Panel>

			<Tabs.Panel value="professions">
				<Suspense fallback={<CheckboxListFormSkeleton type="professions" />}>
					<ProfessionsList />
				</Suspense>
			</Tabs.Panel>

			<Tabs.Panel value="missions">
				<Suspense fallback={<CheckboxListFormSkeleton type="missions" />}>
					<MissionsList />
				</Suspense>
			</Tabs.Panel>
		</Tabs>
	);
};

export default SavedData;
