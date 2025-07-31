import { Checkbox, Flex, Group, Popover, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { QuestionIcon } from "@phosphor-icons/react";
import React from "react";
import { useSelectedDataCount } from "../../hooks";
import type { GameDataType } from "./GameDataForm";

export interface Data {
	id: number;
	name: string;
	popoverContent?: React.ReactNode;
	isUnlocked?: boolean;
}

export interface DisabledData extends Data {
	popoverContent: React.ReactNode;
}

type CheckboxListItemProps = {
	type: GameDataType;
	item: Data;
	disabledItemsMap: Map<number, DisabledData>;
	selectedSet: Set<number>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChange: (event: any[]) => void;
};

const CheckboxListItem: React.FC<CheckboxListItemProps> = ({
	type,
	item,
	disabledItemsMap,
	selectedSet,
	onChange,
}) => {
	const theme = useMantineTheme();
	const [opened, { close, open }] = useDisclosure(false);
	const { updateCount } = useSelectedDataCount();
	const isDisabledItem = disabledItemsMap.has(item.id);

	const handleCheckbox = (
		ids: Set<number>,
		id: number,
		onChange: (v: number[]) => void
	) => {
		const newIds = new Set(ids);
		if (newIds.has(id)) {
			newIds.delete(id);
		} else {
			newIds.add(Number(id));
		}
		onChange(Array.from(newIds));
		updateCount(type, newIds.size);
	};

	return (
		<Popover
			position="bottom"
			withArrow
			shadow="md"
			opened={opened}
			key={`${item.id}-${item.name}`}
			disabled={
				(item?.isUnlocked || item?.popoverContent == null) &&
				!disabledItemsMap.has(item.id)
			}
			styles={{ dropdown: { maxWidth: "400px" } }}
		>
			<Popover.Target>
				<Group
					w={{
						base: "48%",
						sm: "30%",
						md: "23%",
					}}
					gap="md"
					onMouseEnter={open}
					onMouseLeave={close}
					align="start"
				>
					<Flex flex={1}>
						<Checkbox
							value={item.id.toString()}
							label={item.name}
							checked={selectedSet.has(item.id)}
							onChange={() => handleCheckbox(selectedSet, item.id, onChange)}
							disabled={disabledItemsMap.has(item.id)}
							size="sm"
							styles={{ label: { paddingInlineStart: "12px" } }}
						/>
					</Flex>

					{!isDisabledItem &&
						!item?.isUnlocked &&
						item?.popoverContent != null && (
							<Flex mt={2}>
								<QuestionIcon color={theme.colors.dark[2]} />
							</Flex>
						)}

					{isDisabledItem && (
						<Flex mt={2}>
							<QuestionIcon color={theme.colors.dark[2]} />
						</Flex>
					)}
				</Group>
			</Popover.Target>
			<Popover.Dropdown style={{ pointerEvents: "none" }}>
				{isDisabledItem
					? disabledItemsMap.get(item.id)?.popoverContent
					: item?.popoverContent}
			</Popover.Dropdown>
		</Popover>
	);
};

export default CheckboxListItem;
