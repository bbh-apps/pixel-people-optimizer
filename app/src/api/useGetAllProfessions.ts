import {
	useSuspenseQuery,
	type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { ProfessionListRes } from "../types/models";

const useGetProfessions = (): UseSuspenseQueryResult<ProfessionListRes[]> => {
	return useSuspenseQuery({
		queryKey: ["professions", "list"],
		queryFn: async (): Promise<ProfessionListRes[]> =>
			await fetchClient("/api/professions"),
	});
};

export default useGetProfessions;
