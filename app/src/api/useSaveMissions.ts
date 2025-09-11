import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SaveMissionsInput } from "../components/shared/schema";
import { fetchClient } from "../lib/fetchClient";
import type { SaveMissionRes } from "../types/models";
import { useAuth } from "./useAuth";

const useSaveMissions = () => {
	const queryClient = useQueryClient();
	const { token } = useAuth();
	return useMutation<SaveMissionRes, Error, SaveMissionsInput>({
		mutationKey: ["missions", "save"],
		mutationFn: async (data: SaveMissionsInput) =>
			await fetchClient("/api/missions/me", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token ? `Bearer ${token}` : "",
				},
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["missions", "saved"] });
			queryClient.invalidateQueries({ queryKey: ["professions"] });
			queryClient.invalidateQueries({ queryKey: ["recommendations"] });
		},
	});
};

export default useSaveMissions;
