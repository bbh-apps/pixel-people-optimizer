import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SaveProfessionsInput } from "../components/shared/schema";
import { fetchClient } from "../lib/fetchClient";
import { useAuth } from "./useAuth";

const useSaveProfessions = () => {
	const queryClient = useQueryClient();
	const { token } = useAuth();
	return useMutation({
		mutationKey: ["professions", "save"],
		mutationFn: async (data: SaveProfessionsInput) =>
			await fetchClient("/api/professions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token ? `Bearer ${token}` : "",
				},
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["professions", "saved"] });
		},
	});
};

export default useSaveProfessions;
