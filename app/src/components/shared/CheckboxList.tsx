import { Group, ScrollArea, useMatches } from "@mantine/core";
import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type z from "zod";
import CheckboxListItem, {
	type Data,
	type DisabledData,
} from "./CheckboxListItem";
import CheckboxListItemMobile from "./CheckboxListItemMobile";
import type { GameDataType } from "./GameDataForm";
import type { saveEntitySchema } from "./schema";

type SaveCheckboxGroupInput = z.infer<typeof saveEntitySchema>;

type CheckboxListProps = {
	type: GameDataType;
	items: Data[];
	disabledItems: DisabledData[];
};

const CheckboxList: React.FC<CheckboxListProps> = ({
	type,
	items,
	disabledItems = [],
}) => {
	const { control, watch } = useFormContext<SaveCheckboxGroupInput>();
	const height = useMatches({
		base: 190,
		sm: 180,
	});

	const watchedIds = watch("ids");
	const selectedSet = useMemo(() => new Set(watchedIds), [watchedIds]);

	const disabledItemsMap: Map<number, DisabledData> = new Map();
	disabledItems.forEach((item) => disabledItemsMap.set(item.id, item));

	return (
		<ScrollArea h={height} px="lg">
			<Controller
				control={control}
				name="ids"
				render={({ field }) => (
					<>
						<Group align="start" gap="sm" visibleFrom="sm">
							{items.map((item) => (
								<CheckboxListItem
									key={`${item.id}-${item.name}`}
									type={type}
									item={item}
									disabledItemsMap={disabledItemsMap}
									selectedSet={selectedSet}
									onChange={field.onChange}
								/>
							))}
						</Group>
						<Group align="start" gap="sm" hiddenFrom="sm">
							{items.map((item) => (
								<CheckboxListItemMobile
									key={`${item.id}-${item.name}-mobile`}
									type={type}
									item={item}
									disabledItemsMap={disabledItemsMap}
									selectedSet={selectedSet}
									onChange={field.onChange}
								/>
							))}
						</Group>
					</>
				)}
			/>
		</ScrollArea>
	);
};

export default CheckboxList;
