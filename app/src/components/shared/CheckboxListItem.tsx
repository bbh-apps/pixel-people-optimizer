import { Box, Checkbox, Popover, Text, useMatches } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

interface Data {
	id: number;
	name: string;
}

interface DisabledData extends Data {
	reason: string;
}

type CheckboxListItemProps = {
	item: Data;
	disabledItemsMap: Map<number, DisabledData>;
	selectedSet: Set<number>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChange: (event: any[]) => void;
};

const CheckboxListItem: React.FC<CheckboxListItemProps> = ({
	item,
	disabledItemsMap,
	selectedSet,
	onChange,
}) => {
	const widths = useMatches({
		base: "45%",
		sm: "30%",
		md: "23%",
	});

	const [opened, { close, open }] = useDisclosure(false);

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
	};

	return (
		<Popover
			width={200}
			position="bottom"
			withArrow
			shadow="md"
			opened={opened}
			key={`${item.id}-${item.name}`}
			disabled={!disabledItemsMap.has(item.id)}
		>
			<Popover.Target>
				<Box onMouseEnter={open} onMouseLeave={close} w={widths}>
					<Checkbox
						value={item.id.toString()}
						label={item.name}
						checked={selectedSet.has(item.id)}
						onChange={() => handleCheckbox(selectedSet, item.id, onChange)}
						disabled={disabledItemsMap.has(item.id)}
					/>
				</Box>
			</Popover.Target>
			<Popover.Dropdown style={{ pointerEvents: "none" }}>
				<Text size="sm">{disabledItemsMap.get(item.id)?.reason ?? "n/a"}</Text>
			</Popover.Dropdown>
		</Popover>
	);
};

export default CheckboxListItem;
