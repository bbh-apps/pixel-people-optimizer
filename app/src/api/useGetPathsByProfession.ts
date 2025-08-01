import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { ProfessionPathsRes } from "../types/models";

const useGetPathsByProfession = ({
	id,
}: {
	id: number | undefined;
}): UseQueryResult<ProfessionPathsRes> => {
	return useQuery({
		queryKey: ["profession", id, "paths"],
		queryFn: async (): Promise<ProfessionPathsRes> =>
			await fetchClient(`/api/professions/${id}/paths`),
		enabled: !!id,
	});
};

export default useGetPathsByProfession;
