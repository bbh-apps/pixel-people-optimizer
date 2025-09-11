import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SaveProfessionsInput } from "../components/shared/schema";
import { fetchClient } from "../lib/fetchClient";
import type { SaveProfessionRes } from "../types/models";
import { useAuth } from "./useAuth";

const useSaveProfessions = ({
	includeBuildings = false,
}: {
	includeBuildings?: boolean;
}) => {
	const queryClient = useQueryClient();
	const { token } = useAuth();
	return useMutation<SaveProfessionRes, Error, SaveProfessionsInput>({
		mutationKey: ["professions", "save"],
		mutationFn: async (data: SaveProfessionsInput) =>
			await fetchClient("/api/professions/me", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token ? `Bearer ${token}` : "",
				},
				body: JSON.stringify({ ...data, include_buildings: includeBuildings }),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["professions"] });
			queryClient.invalidateQueries({ queryKey: ["buildings"] });
			queryClient.invalidateQueries({ queryKey: ["recommendations"] });
		},
	});
};

export default useSaveProfessions;
