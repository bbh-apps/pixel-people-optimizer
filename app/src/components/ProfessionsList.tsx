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
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useAuth } from "../api/useAuth";
import useGetProfessions, { type SortType } from "../api/useGetAllProfessions";
import useGetSavedProfessions from "../api/useGetSavedProfessions";
import useSaveProfessions from "../api/useSaveProfessions";
import { usePendingSaveGameData } from "../hooks/usePendingSaveGameData";
import { useSaveGameDataForms } from "../hooks/useSaveGameDataForms";
import type { ProfessionListRes } from "../types/models";
import AuthModal from "./AuthModal";
import { AccordionCard, CheckboxList } from "./shared";
import { saveEntitySchema, type SaveProfessionsInput } from "./shared/schema";

const DEFAULT_START_PROF_IDS = [1, 2];

const ProfessionsList = () => {
	const { token } = useAuth();
	const width = useMatches({
		base: "100%",
		sm: "49%",
	});

	const [sortType, setSortType] = useState<SortType>("gallery");
	const { data: professions } = useGetProfessions(sortType);
	const { data: userProfessions } = useGetSavedProfessions();

	const formMethods = useForm<SaveProfessionsInput>({
		resolver: zodResolver(saveEntitySchema),
		defaultValues: {
			ids: [],
		},
		values: {
			ids: !token
				? DEFAULT_START_PROF_IDS
				: userProfessions?.map((b) => b.id) ?? [],
		},
	});
	const {
		handleSubmit,
		formState: { isDirty },
		reset,
		watch,
	} = formMethods;

	const { registerSaveCallback, unregisterSaveCallback, triggerSaveAll } =
		useSaveGameDataForms();
	const { addPendingSave } = usePendingSaveGameData();
	const {
		mutate: saveProfessions,
		mutateAsync: saveProfessionsAsync,
		isPending,
	} = useSaveProfessions();
	const [authOpen, setAuthOpen] = useState(false);

	const [professionsSearch, setProfessionsSearch] = useState<string>("");
	const [debounced] = useDebouncedValue(professionsSearch, 200);
	const [sortedProfessions, setSortedProfessions] = useState(professions);

	const [filteredProfessions, setFilteredProfessions] =
		useState<ProfessionListRes[]>(sortedProfessions);

	const onSubmit = async (data: SaveProfessionsInput) => {
		if (token) {
			saveProfessions(data);
			reset(data);
		} else {
			addPendingSave("professions", data, async (input) => {
				await saveProfessionsAsync(input);
			});
		}
	};

	const onClickSort = (newSortType: SortType) => {
		if (newSortType !== sortType) {
			if (newSortType === "abc") {
				setSortedProfessions(
					professions.sort((a, b) => a.name.localeCompare(b.name))
				);
			} else if (newSortType === "gallery") {
				setSortedProfessions(professions.sort((a, b) => a.id - b.id));
			}
			setSortType(newSortType);
		}
	};

	useEffect(() => {
		if (!token) {
			registerSaveCallback("professions", () => handleSubmit(onSubmit)());

			return () => unregisterSaveCallback("professions");
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handleSubmit, onSubmit]);

	useEffect(() => {
		const filtered = sortedProfessions.filter((p) =>
			p.name.toLowerCase().includes(debounced)
		);
		setFilteredProfessions(filtered);
	}, [sortedProfessions, debounced]);

	return (
		<Flex w={width}>
			<AuthModal opened={authOpen} onClose={() => setAuthOpen(false)} />
			<FormProvider {...formMethods}>
				<form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
					<AccordionCard
						title="My Professions"
						savedItemCount={(watch("ids") ?? userProfessions ?? []).length}
					>
						<TextInput
							placeholder="Search for a profession"
							value={professionsSearch}
							onChange={(e) => setProfessionsSearch(e.target.value)}
							px="md"
						/>
						<Flex direction="column" gap="md" pt="xs">
							<CheckboxList items={filteredProfessions} />
							<Group justify="space-between" px="md" pb="md" align="center">
								<Text size="xs">* Note: Special genes listed at the end</Text>
								<Group gap="xs">
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
								</Group>
							</Group>
						</Flex>
					</AccordionCard>
				</form>
			</FormProvider>
		</Flex>
	);
};

export default ProfessionsList;
