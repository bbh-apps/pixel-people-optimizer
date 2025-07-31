import {
	ActionIcon,
	Checkbox,
	Flex,
	Group,
	Modal,
	useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { QuestionIcon } from "@phosphor-icons/react";
import React from "react";
import { useSelectedDataCount } from "../../hooks";
import type { Data, DisabledData } from "./CheckboxListItem";
import type { GameDataType } from "./GameDataForm";

type CheckboxListItemMobileProps = {
	type: GameDataType;
	item: Data;
	disabledItemsMap: Map<number, DisabledData>;
	selectedSet: Set<number>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChange: (event: any[]) => void;
};

const CheckboxListItemMobile: React.FC<CheckboxListItemMobileProps> = ({
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
		<>
			<Group
				w="100%"
				gap={2}
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
						styles={{
							label: { paddingInlineStart: "8px" },
						}}
					/>
				</Flex>

				{!isDisabledItem &&
					!item?.isUnlocked &&
					item?.popoverContent != null && (
						<Flex mt={2}>
							<ActionIcon variant="transparent" onClick={open} p={0} size={16}>
								<QuestionIcon color={theme.colors.dark[2]} size={16} />
							</ActionIcon>
						</Flex>
					)}

				{isDisabledItem && (
					<Flex mt={2}>
						<ActionIcon variant="transparent" onClick={open} p={0} size={16}>
							<QuestionIcon color={theme.colors.dark[2]} size={16} />
						</ActionIcon>
					</Flex>
				)}
			</Group>
			<Modal opened={opened} onClose={close} centered withCloseButton={false}>
				{isDisabledItem
					? disabledItemsMap.get(item.id)?.popoverContent
					: item?.popoverContent}
			</Modal>
		</>
	);
};

export default CheckboxListItemMobile;
