import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SaveMissionsInput } from "../components/shared/schema";
import { fetchClient } from "../lib/fetchClient";
import type { IDList } from "../types/models";
import { useAuth } from "./useAuth";

const useSaveMissions = () => {
	const queryClient = useQueryClient();
	const { token } = useAuth();
	return useMutation<IDList, Error, SaveMissionsInput>({
		mutationKey: ["missions", "save"],
		mutationFn: async (data: SaveMissionsInput) =>
			await fetchClient("/api/missions", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token ? `Bearer ${token}` : "",
				},
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["missions", "saved"] });
			queryClient.invalidateQueries({ queryKey: ["recommendations"] });
		},
	});
};

export default useSaveMissions;
