import { Group, ScrollArea } from "@mantine/core";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type z from "zod";
import CheckboxListItem from "./CheckboxListItem";
import type { saveEntitySchema } from "./schema";

type SaveCheckboxGroupInput = z.infer<typeof saveEntitySchema>;
interface Data {
	id: number;
	name: string;
}

interface DisabledData extends Data {
	reason: string;
}

type CheckboxListProps = {
	items: Data[];
	disabledItems: DisabledData[];
};

const CheckboxList: React.FC<CheckboxListProps> = ({
	items,
	disabledItems = [],
}) => {
	const { control, watch } = useFormContext<SaveCheckboxGroupInput>();

	const watchedIds = watch("ids");
	const selectedSet = useMemo(() => new Set(watchedIds), [watchedIds]);

	const disabledItemsMap: Map<number, DisabledData> = new Map();
	disabledItems.forEach((item) => disabledItemsMap.set(item.id, item));

	return (
		<ScrollArea h={180} px="lg">
			<Controller
				control={control}
				name="ids"
				render={({ field }) => (
					<Group>
						{items.map((item) => (
							<CheckboxListItem
								key={`${item.id}-${item.name}`}
								item={item}
								disabledItemsMap={disabledItemsMap}
								selectedSet={selectedSet}
								onChange={field.onChange}
							/>
						))}
					</Group>
				)}
			/>
		</ScrollArea>
	);
};

export default CheckboxList;
