import {
	useSuspenseQuery,
	type UseSuspenseQueryResult,
} from "@tanstack/react-query";
import type { ProfessionListRes } from "../types/models";

const useGetProfessions = (): UseSuspenseQueryResult<ProfessionListRes[]> => {
	return useSuspenseQuery({
		queryKey: ["professions", "list"],
		queryFn: async (): Promise<ProfessionListRes[]> =>
			await fetch("/api/professions")
				.then((res): Promise<ProfessionListRes[]> => res.json())
				.then((res) => res),
	});
};

export default useGetProfessions;
