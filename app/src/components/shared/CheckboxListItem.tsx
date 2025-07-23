import {
	Checkbox,
	Flex,
	Group,
	Popover,
	useMantineTheme,
	useMatches,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { QuestionIcon } from "@phosphor-icons/react";
import React from "react";
import { useSelectedDataCount } from "../../hooks";
import type { GameDataType } from "./GameDataForm";

export interface Data {
	id: number;
	name: string;
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
	const widths = useMatches({
		base: "45%",
		sm: "30%",
		md: "23%",
	});
	const sizes = useMatches({
		base: "xs",
		sm: "sm",
	});

	const popoverWidths = useMatches({
		base: 200,
		sm: 300,
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
		<Popover
			width={popoverWidths}
			position="bottom"
			withArrow
			shadow="md"
			opened={opened}
			key={`${item.id}-${item.name}`}
			disabled={!disabledItemsMap.has(item.id)}
		>
			<Popover.Target>
				<Group w={widths} gap={4} onMouseEnter={open} onMouseLeave={close}>
					<Flex flex={1}>
						<Checkbox
							value={item.id.toString()}
							label={item.name}
							checked={selectedSet.has(item.id)}
							onChange={() => handleCheckbox(selectedSet, item.id, onChange)}
							disabled={disabledItemsMap.has(item.id)}
							size={sizes}
						/>
					</Flex>

					{disabledItemsMap.has(item.id) && (
						<Flex hiddenFrom="sm" align="center">
							<QuestionIcon color={theme.colors.dark[2]} />
						</Flex>
					)}
				</Group>
			</Popover.Target>
			<Popover.Dropdown style={{ pointerEvents: "none" }}>
				{disabledItemsMap.get(item.id)?.popoverContent}
			</Popover.Dropdown>
		</Popover>
	);
};

export default CheckboxListItem;
