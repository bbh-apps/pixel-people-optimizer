import { Button, Menu } from "@mantine/core";
import { CheckIcon } from "@phosphor-icons/react";

export type SortOptions<TSortType> = {
	type: TSortType;
	label: string;
};

type SortMenuProps<TSortType> = {
	sortOptions: SortOptions<TSortType>[];
	sortType: TSortType;
	setSortType: (sortBy: TSortType) => void;
};

const SortMenu = <TSortType extends string>({
	sortOptions,
	sortType,
	setSortType,
}: SortMenuProps<TSortType>) => {
	const onClickSort = (newSortType: TSortType) => {
		if (newSortType !== sortType) {
			setSortType(newSortType);
		}
	};

	return (
		<Menu>
			<Menu.Target>
				<Button px="xs">Sort order</Button>
			</Menu.Target>
			<Menu.Dropdown>
				{sortOptions.map((option) => (
					<Menu.Item
						key={option.label}
						leftSection={
							sortType === option.type ? (
								<CheckIcon color="var(--mantine-color-text)" />
							) : null
						}
						onClick={() => onClickSort(option.type)}
					>
						{option.label}
					</Menu.Item>
				))}
			</Menu.Dropdown>
		</Menu>
	);
};

export default SortMenu;
