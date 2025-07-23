import {
	Badge,
	Combobox,
	Group,
	Input,
	InputBase,
	Paper,
	Skeleton,
	Stack,
	Text,
	useCombobox,
} from "@mantine/core";
import React, { useState } from "react";
import { useSelectedDataCount } from "../../hooks";
import type { GameDataType } from "../shared/GameDataForm";
import BuildingsList from "./BuildingsList";
import MissionsList from "./MissionsList";
import ProfessionsList from "./ProfessionsList";
import type { SavedDataItem } from "./SavedData";

type SavedDataMobileProps = {
	items: SavedDataItem[];
};

const SelectOption = ({ title, value, icon }: SavedDataItem) => {
	const { getCountByType } = useSelectedDataCount();
	const count = getCountByType(value);
	return (
		<Group gap="xs">
			{icon}
			<Text>{title}</Text>
			{count == null ? (
				<Skeleton h={12} w={12} radius="xs" />
			) : (
				<Badge
					color="blue"
					variant="light"
					styles={{ root: { borderRadius: "2px", padding: "4px" } }}
				>
					{getCountByType(value)}
				</Badge>
			)}
		</Group>
	);
};

const SavedDataMobile: React.FC<SavedDataMobileProps> = ({ items }) => {
	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	const [value, setValue] = useState<GameDataType>("buildings");
	const selectedOption = items.find((item) => item.value === value);

	const options = items.map((item) => (
		<Combobox.Option value={item.value} key={item.value}>
			<SelectOption {...item} />
		</Combobox.Option>
	));

	const getListToRender = (type: GameDataType) => {
		switch (type) {
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
		<Stack gap="sm" hiddenFrom="sm">
			<Combobox
				store={combobox}
				withinPortal={false}
				onOptionSubmit={(val) => {
					setValue(val as GameDataType);
					combobox.closeDropdown();
				}}
			>
				<Combobox.Target>
					<InputBase
						component="button"
						type="button"
						pointer
						rightSection={<Combobox.Chevron />}
						onClick={() => combobox.toggleDropdown()}
						rightSectionPointerEvents="none"
						multiline
						size="lg"
					>
						{selectedOption ? (
							<SelectOption {...selectedOption} />
						) : (
							<Input.Placeholder>Pick value</Input.Placeholder>
						)}
					</InputBase>
				</Combobox.Target>

				<Combobox.Dropdown>
					<Combobox.Options>{options}</Combobox.Options>
				</Combobox.Dropdown>
			</Combobox>

			{items.map((item) => (
				<Paper
					withBorder
					py="md"
					key={`${item.value}-list`}
					display={value === item.value ? "flex" : "none"}
				>
					{getListToRender(item.value)}
				</Paper>
			))}
		</Stack>
	);
};

export default SavedDataMobile;
