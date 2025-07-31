import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SaveProfessionsInput } from "../components/shared/schema";
import { fetchClient } from "../lib/fetchClient";
import type { IDList } from "../types/models";
import { useAuth } from "./useAuth";

const useSaveProfessions = () => {
	const queryClient = useQueryClient();
	const { token } = useAuth();
	return useMutation<IDList, Error, SaveProfessionsInput>({
		mutationKey: ["professions", "save"],
		mutationFn: async (data: SaveProfessionsInput) =>
			await fetchClient("/api/professions/me", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token ? `Bearer ${token}` : "",
				},
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["saved_items_count"] });
			queryClient.invalidateQueries({ queryKey: ["professions", "saved"] });
			queryClient.invalidateQueries({ queryKey: ["recommendations"] });
		},
	});
};

export default useSaveProfessions;
