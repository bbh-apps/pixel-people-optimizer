import {
	BuildingOfficeIcon,
	PersonIcon,
	RocketLaunchIcon,
} from "@phosphor-icons/react";
import type { GameDataType } from "../shared/GameDataForm";
import SavedDataMobile from "./SavedDataMobile";
import SavedDataTabs from "./SavedDataTabs";

export type SavedDataItem = {
	title: string;
	icon: React.ReactNode;
	value: GameDataType;
};

const SavedData = () => {
	const items: SavedDataItem[] = [
		{
			title: "My Buildings",
			icon: <BuildingOfficeIcon />,
			value: "buildings",
		},
		{
			title: "My Discovered Professions",
			icon: <PersonIcon />,
			value: "professions",
		},
		{
			title: "My Completed Missions",
			icon: <RocketLaunchIcon />,
			value: "missions",
		},
	];

	return (
		<>
			<SavedDataMobile items={items} />
			<SavedDataTabs items={items} />
		</>
	);
};

export default SavedData;
