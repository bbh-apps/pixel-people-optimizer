import { Box, em, Group, ScrollArea, useMatches } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useMemo, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type z from "zod";
import CheckboxListItem, {
	type DisabledData,
	type EntityDetail,
} from "./CheckboxListItem";
import CheckboxListItemMobile from "./CheckboxListItemMobile";
import type { GameDataType } from "./GameDataForm";
import type { saveEntitySchema } from "./schema";

type SaveCheckboxGroupInput = z.infer<typeof saveEntitySchema>;

type CheckboxListProps = {
	type: GameDataType;
	items: EntityDetail[];
	disabledItems: DisabledData[];
};

const chunk = <T,>(arr: T[], size: number): T[][] => {
	const chunks: T[][] = [];
	for (let i = 0; i < arr.length; i += size) {
		chunks.push(arr.slice(i, i + size));
	}
	return chunks;
};

const CheckboxList: React.FC<CheckboxListProps> = ({
	type,
	items,
	disabledItems = [],
}) => {
	const { control, watch } = useFormContext<SaveCheckboxGroupInput>();

	const watchedIds = watch("ids");
	const selectedSet = useMemo(() => new Set(watchedIds), [watchedIds]);

	const disabledItemsMap: Map<number, DisabledData> = new Map();
	disabledItems.forEach((item) => disabledItemsMap.set(item.id, item));

	const parentRef = useRef<HTMLDivElement>(null);

	const columns = useMatches({
		base: 1,
		sm: 3,
		md: 4,
	});
	const rows = useMemo(() => chunk(items, columns), [columns, items]);

	const rowVirtualizer = useVirtualizer({
		count: rows.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 48,
		overscan: 5,
	});

	const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

	return (
		<ScrollArea
			h={{
				base: 190,
				sm: 160,
			}}
			px="lg"
			viewportRef={parentRef}
		>
			<Controller
				control={control}
				name="ids"
				render={({ field }) => (
					<Box
						h={`${rowVirtualizer.getTotalSize()}px`}
						style={{
							position: "relative",
						}}
					>
						{rowVirtualizer.getVirtualItems().map((virtualRow) => {
							const rowItems = rows[virtualRow.index];
							return (
								<Group
									key={virtualRow.key}
									ref={(el) => rowVirtualizer.measureElement(el)}
									data-index={virtualRow.index}
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										transform: `translateY(${virtualRow.start}px)`,
										width: "100%",
									}}
									align="start"
									gap="sm"
									py={6}
								>
									{rowItems.map((item) =>
										isMobile ? (
											<CheckboxListItemMobile
												key={`${item.id}-${item.name}-mobile`}
												type={type}
												item={item}
												disabledItemsMap={disabledItemsMap}
												selectedSet={selectedSet}
												onChange={field.onChange}
											/>
										) : (
											<CheckboxListItem
												key={`${item.id}-${item.name}`}
												type={type}
												item={item}
												disabledItemsMap={disabledItemsMap}
												selectedSet={selectedSet}
												onChange={field.onChange}
											/>
										)
									)}
								</Group>
							);
						})}
					</Box>
				)}
			/>
		</ScrollArea>
	);
};

export default CheckboxList;
