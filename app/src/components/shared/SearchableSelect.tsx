import { Combobox, InputBase, useCombobox } from "@mantine/core";
import type React from "react";
import { useCallback, useState } from "react";
import type { BaseEntityRes } from "../../types/models";

type SearchableSelectProps = {
	value: BaseEntityRes | null;
	setValue: (v: BaseEntityRes | null) => void;
	options: BaseEntityRes[];
	placeholder?: string;
};

const SearchableSelect: React.FC<SearchableSelectProps> = ({
	value,
	setValue,
	options,
	placeholder = "Search values",
}) => {
	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	const [search, setSearch] = useState("");

	const shouldFilterOptions = options.every((item) => item.name !== search);
	const filteredOptions = shouldFilterOptions
		? options.filter((item) =>
				item.name.toLowerCase().includes(search.toLowerCase().trim())
		  )
		: options;

	const optionsComponent = filteredOptions.map((item) => (
		<Combobox.Option value={item.name} key={item.id}>
			{item.name}
		</Combobox.Option>
	));

	const findEntityByValue = useCallback(
		(val: string) => {
			return options.find((o) => o.name === val) ?? null;
		},
		[options]
	);

	return (
		<Combobox
			store={combobox}
			withinPortal={false}
			onOptionSubmit={(val) => {
				const newValue = findEntityByValue(val);
				setValue(newValue);
				setSearch(val);
				combobox.closeDropdown();
			}}
		>
			<Combobox.Target>
				<InputBase
					rightSection={<Combobox.Chevron />}
					value={search}
					onChange={(event) => {
						combobox.openDropdown();
						combobox.updateSelectedOptionIndex();
						setSearch(event.currentTarget.value);
					}}
					onClick={() => combobox.openDropdown()}
					onFocus={() => combobox.openDropdown()}
					onBlur={() => {
						combobox.closeDropdown();
						const newValue =
							value != null ? findEntityByValue(value.name) : null;
						setValue(newValue);
						setSearch(value?.name ?? "");
					}}
					placeholder={placeholder}
					rightSectionPointerEvents="none"
				/>
			</Combobox.Target>

			<Combobox.Dropdown>
				<Combobox.Options mah={200} style={{ overflowY: "auto" }}>
					{options.length > 0 ? (
						optionsComponent
					) : (
						<Combobox.Empty>Nothing found</Combobox.Empty>
					)}
				</Combobox.Options>
			</Combobox.Dropdown>
		</Combobox>
	);
};

export default SearchableSelect;
