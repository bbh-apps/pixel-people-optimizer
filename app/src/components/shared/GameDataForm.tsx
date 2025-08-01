import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Flex,
	Group,
	Text,
	TextInput,
	useMatches,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import type { UseMutationResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "../../api/useAuth";

import { ErrorBoundary } from "react-error-boundary";
import { useSelectedDataCount } from "../../hooks";
import { usePendingSaveGameData } from "../../hooks/usePendingSaveGameData";
import { useSaveGameDataForms } from "../../hooks/useSaveGameDataForms";
import type { IDList } from "../../types/models";
import AuthModal from "../AuthModal";
import CheckboxList from "./CheckboxList";
import CheckboxListFormSkeleton from "./CheckboxListFormSkeleton";
import type { DisabledData, EntityDetail } from "./CheckboxListItem";
import ErrorBoundaryAlert from "./ErrorBoundaryAlert";
import { saveEntitySchema } from "./schema";
import SortMenu, { type SortOptions } from "./SortMenu";

export type GameDataType = "buildings" | "professions" | "missions";

type GameDataFormProps<
	TData extends EntityDetail,
	TUserData extends EntityDetail,
	TSortType extends string
> = {
	type: GameDataType;
	gameData: TData[];
	savedData: TUserData[] | undefined;
	defaultIds: number[];
	saveMutation: UseMutationResult<
		IDList,
		Error,
		{
			ids: number[];
		},
		unknown
	>;
	disabledData?: DisabledData[];
	hasSort?: boolean;
	sortOptions?: SortOptions<TSortType>[];
	sortType?: TSortType;
	setSortType?: (sortBy: TSortType) => void;
	sortFn?: (sortBy: TSortType, data: TData[]) => TData[];
};

const GameDataForm = <
	TData extends EntityDetail,
	TUserData extends EntityDetail,
	TSortType extends string
>({
	type,
	gameData,
	savedData,
	defaultIds,
	saveMutation,
	disabledData = [],
	hasSort = false,
	sortOptions = [],
	sortType,
	setSortType = () => {},
	sortFn = () => [],
}: GameDataFormProps<TData, TUserData, TSortType>) => {
	const { token } = useAuth();
	const justify = useMatches(
		hasSort
			? {
					base: "end",
					sm: "space-between",
			  }
			: { base: "end" }
	);

	const formMethods = useForm<{
		ids: number[];
	}>({
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
	const selectedSet = watch("ids");
	const { updateCount } = useSelectedDataCount();

	const onSubmit = async (data: { ids: number[] }) => {
		if (token) {
			saveData(data);
			reset(data);
		} else {
			addPendingSave(type, data, async (input) => {
				await saveDataAsync(input);
			});
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
		if (!sortFn || !sortType) return;

		// Step 1: sort first
		const sorted = sortFn(sortType, gameData);

		// Step 2: apply filter
		const filtered = sorted.filter((item) =>
			item.name.toLowerCase().includes(debounced.toLowerCase())
		);

		setSortedData(sorted); // optional: keep for other uses
		setFilteredData(filtered);
	}, [gameData, debounced, sortType, sortFn]);

	useEffect(() => {
		const selectedCount = selectedSet.length;
		if (token && savedData) {
			updateCount(
				type,
				selectedCount > savedData.length ? selectedCount : savedData.length
			);
		} else {
			updateCount(type, selectedCount);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [savedData, selectedSet]);

	if (sortedData.length === 0) {
		return <CheckboxListFormSkeleton type={type} />;
	}

	return (
		<Flex w="100%">
			<AuthModal opened={authOpen} onClose={() => setAuthOpen(false)} />
			<FormProvider {...formMethods}>
				<form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
					<TextInput
						placeholder={`Search ${type}`}
						value={dataSearch}
						onChange={(e) => setDataSearch(e.target.value)}
						px="md"
					/>
					<Flex direction="column" gap="md" pt="xs">
						<ErrorBoundary
							fallbackRender={({ error }) => (
								<ErrorBoundaryAlert message={error.message} />
							)}
						>
							<CheckboxList
								type={type}
								items={filteredData}
								disabledItems={disabledData}
							/>
						</ErrorBoundary>

						{type === "professions" && (
							<Text size="xs" hiddenFrom="sm" px="md">
								* Note: Special genes listed at the end
							</Text>
						)}
						<Group justify={justify} px="md" align="center">
							{hasSort && (
								<Flex flex={1}>
									{type === "professions" && (
										<Text size="xs" visibleFrom="sm">
											Note: Special genes listed at the end
										</Text>
									)}
								</Flex>
							)}
							<Flex gap="sm">
								{hasSort && (
									<ErrorBoundary
										fallbackRender={({ error }) => (
											<ErrorBoundaryAlert message={error.message} />
										)}
									>
										<SortMenu
											sortOptions={sortOptions}
											sortType={sortType as TSortType}
											setSortType={setSortType}
										/>
									</ErrorBoundary>
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
				</form>
			</FormProvider>
		</Flex>
	);
};

export default GameDataForm;
