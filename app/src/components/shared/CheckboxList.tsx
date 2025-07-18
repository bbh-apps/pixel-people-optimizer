import { Checkbox, Group, ScrollArea } from "@mantine/core";
import { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type z from "zod";
import type { saveEntitySchema } from "./schema";

type SaveCheckboxGroupInput = z.infer<typeof saveEntitySchema>;

type CheckboxListProps = {
	items: { id: number; name: string }[];
};

const CheckboxList: React.FC<CheckboxListProps> = ({ items }) => {
	const { control, watch } = useFormContext<SaveCheckboxGroupInput>();

	const watchedIds = watch("ids");
	const selectedSet = useMemo(() => new Set(watchedIds), [watchedIds]);

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
		<ScrollArea h={240} px="md">
			<Controller
				control={control}
				name="ids"
				render={({ field }) => (
					<Group>
						{items.map((item) => (
							<Checkbox
								w="45%"
								key={`${item.id}-${item.name}`}
								value={item.id.toString()}
								label={item.name}
								checked={selectedSet.has(item.id)}
								onChange={() =>
									handleCheckbox(selectedSet, item.id, field.onChange)
								}
							/>
						))}
					</Group>
				)}
			/>
		</ScrollArea>
	);
};

export default CheckboxList;
