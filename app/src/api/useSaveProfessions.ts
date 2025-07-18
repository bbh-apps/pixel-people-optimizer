import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SaveProfessionsInput } from "../components/shared/schema";
import { useAuth } from "./useAuth";

const useSaveProfessions = () => {
	const queryClient = useQueryClient();
	const { token } = useAuth();
	return useMutation({
		mutationKey: ["professions", "save"],
		mutationFn: async (data: SaveProfessionsInput) => {
			fetch("/api/professions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token ? `Bearer ${token}` : "",
				},
				body: JSON.stringify(data),
			}).then((res) => {
				if (!res.ok) throw new Error("Failed to save");
				return res.json();
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["professions", "saved"] });
		},
	});
};

export default useSaveProfessions;
