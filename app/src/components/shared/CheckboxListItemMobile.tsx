import {
	ActionIcon,
	Checkbox,
	Flex,
	Group,
	Modal,
	useMantineTheme,
	useMatches,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { QuestionMarkIcon } from "@phosphor-icons/react";
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
	const widths = useMatches({
		base: "45%",
		sm: "30%",
		md: "23%",
	});

	const checkboxPadding = useMatches({
		base: "6px",
		sm: "12px",
	});

	const checkboxesGap = useMatches({
		base: 4,
		sm: "md",
	});

	const align = useMatches({
		base: "start",
		sm: "center",
	});

	const [opened, { close, open }] = useDisclosure(false);
	const { updateCount } = useSelectedDataCount();

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
				w={widths}
				gap={checkboxesGap}
				onMouseEnter={open}
				onMouseLeave={close}
				align={align}
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
							label: { paddingInlineStart: checkboxPadding },
						}}
					/>
				</Flex>

				{!item?.isUnlocked && item?.popoverContent != null && (
					<Flex mt={4}>
						<ActionIcon
							variant="outline"
							onClick={open}
							p={0}
							bdrs="xl"
							size={12}
							color="dark.1"
						>
							<QuestionMarkIcon color={theme.colors.dark[2]} size={10} />
						</ActionIcon>
					</Flex>
				)}

				{disabledItemsMap.has(item.id) && (
					<Flex mt={4}>
						<ActionIcon
							variant="outline"
							onClick={open}
							p={0}
							bdrs="xl"
							size={12}
							color="dark.1"
						>
							<QuestionMarkIcon color={theme.colors.dark[2]} size={10} />
						</ActionIcon>
					</Flex>
				)}
			</Group>
			<Modal opened={opened} onClose={close} centered>
				{item?.popoverContent ?? disabledItemsMap.get(item.id)?.popoverContent}
			</Modal>
		</>
	);
};

export default CheckboxListItemMobile;
