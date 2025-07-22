import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Flex,
	Group,
	Menu,
	Text,
	TextInput,
	useMatches,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { CheckIcon } from "@phosphor-icons/react";
import type { UseMutationResult } from "@tanstack/react-query";
import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "../../api/useAuth";
import type { SortType } from "../../api/useGetAllProfessions";
import { usePendingSaveGameData } from "../../hooks/usePendingSaveGameData";
import { useSaveGameDataForms } from "../../hooks/useSaveGameDataForms";
import type { IDList } from "../../types/models";
import AuthModal from "../AuthModal";
import AccordionCard from "./AccordionCard";
import CheckboxList from "./CheckboxList";
import { saveEntitySchema, type SaveBuildingsInput } from "./schema";

export type GameDataType = "buildings" | "professions";

type Data = {
	id: number;
	name: string;
};

type GameDataFormProps<TData extends Data> = {
	type: GameDataType;
	gameData: TData[];
	savedData: TData[] | undefined;
	defaultIds: number[];
	saveMutation: UseMutationResult<
		IDList,
		Error,
		{
			ids: number[];
		},
		unknown
	>;
	hasSort?: boolean;
	sortType?: SortType;
	setSortType?: (sortBy: SortType) => void;
};

const GameDataForm = <TData extends Data>({
	type,
	gameData,
	savedData,
	defaultIds,
	saveMutation,
	hasSort = false,
	sortType = "abc",
	setSortType = () => {},
}: GameDataFormProps<TData>) => {
	const { token } = useAuth();
	const width = useMatches({
		base: "100%",
		sm: "49%",
	});
	const justify = useMatches(
		hasSort
			? {
					base: "end",
					sm: "space-between",
			  }
			: { base: "end" }
	);

	const formMethods = useForm<SaveBuildingsInput>({
		resolver: zodResolver(saveEntitySchema),
		defaultValues: {
			ids: [],
		},
		values: {
			ids: !token ? defaultIds : savedData?.map((b) => b.id) ?? [],
		},
	});
	const {
		handleSubmit,
		formState: { isDirty },
		reset,
		watch,
	} = formMethods;

	const [dataSearch, setDataSearch] = useState<string>("");
	const [debounced] = useDebouncedValue(dataSearch, 200);
	const [sortedData, setSortedData] = useState<TData[]>(gameData);
	const [filteredData, setFilteredData] = useState<TData[]>(sortedData);

	const { registerSaveCallback, unregisterSaveCallback, triggerSaveAll } =
		useSaveGameDataForms();
	const { addPendingSave } = usePendingSaveGameData();
	const {
		mutate: saveData,
		mutateAsync: saveDataAsync,
		isPending,
	} = saveMutation;
	const [authOpen, setAuthOpen] = useState(false);

	const onSubmit = async (data: SaveBuildingsInput) => {
		if (token) {
			saveData(data);
			reset(data);
		} else {
			addPendingSave(type, data, async (input) => {
				await saveDataAsync(input);
			});
		}
	};

	const onClickSort = (newSortType: SortType) => {
		if (newSortType !== sortType) {
			if (newSortType === "abc") {
				setSortedData(gameData.sort((a, b) => a.name.localeCompare(b.name)));
			} else if (newSortType === "gallery") {
				setSortedData(gameData.sort((a, b) => a.id - b.id));
			}
			setSortType(newSortType);
		}
	};

	useEffect(() => {
		if (!token) {
			registerSaveCallback(type, () => handleSubmit(onSubmit)());

			return () => unregisterSaveCallback(type);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token, handleSubmit, onSubmit]);

	useEffect(() => {
		const filtered = gameData.filter((b) =>
			b.name.toLowerCase().includes(debounced.toLowerCase())
		);
		setFilteredData(filtered);
	}, [gameData, debounced]);

	return (
		<Flex w={width}>
			<AuthModal opened={authOpen} onClose={() => setAuthOpen(false)} />
			<FormProvider {...formMethods}>
				<form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
					<AccordionCard
						title={`My ${capitalize(type)}`}
						savedItemCount={(watch("ids") ?? savedData ?? []).length}
					>
						<TextInput
							placeholder={`Search ${type}`}
							value={dataSearch}
							onChange={(e) => setDataSearch(e.target.value)}
							px="md"
						/>
						<Flex direction="column" gap="md" pt="xs">
							<CheckboxList items={filteredData} />
							{hasSort && (
								<Text size="xs" hiddenFrom="sm" px="md">
									* Note: Special genes listed at the end
								</Text>
							)}
							<Group justify={justify} px="md" pb="md" align="center">
								{hasSort && (
									<Flex flex={1}>
										<Text size="xs" visibleFrom="sm">
											Note: Special genes listed at the end
										</Text>
									</Flex>
								)}
								<Flex gap="sm">
									{hasSort && (
										<Menu>
											<Menu.Target>
												<Button px="xs">Sort order</Button>
											</Menu.Target>
											<Menu.Dropdown>
												<Menu.Item
													leftSection={
														sortType === "gallery" ? (
															<CheckIcon color="var(--mantine-color-text)" />
														) : null
													}
													onClick={() => onClickSort("gallery")}
												>
													Gallery order
												</Menu.Item>
												<Menu.Item
													leftSection={
														sortType === "abc" ? (
															<CheckIcon color="var(--mantine-color-text)" />
														) : null
													}
													onClick={() => onClickSort("abc")}
												>
													ABC order
												</Menu.Item>
											</Menu.Dropdown>
										</Menu>
									)}
									<Button
										variant="filled"
										disabled={!!token && !isDirty}
										loading={isPending}
										onClick={async () => {
											if (!token) {
												await triggerSaveAll();
												setAuthOpen(true);
											} else {
												await handleSubmit(onSubmit)();
											}
										}}
									>
										Save
									</Button>
								</Flex>
							</Group>
						</Flex>
					</AccordionCard>
				</form>
			</FormProvider>
		</Flex>
	);
};

export default GameDataForm;
