import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SaveBuildingsInput } from "../components/shared/schema";
import { fetchClient } from "../lib/fetchClient";
import type { IDList } from "../types/models";
import { useAuth } from "./useAuth";

const useSaveBuildings = () => {
	const queryClient = useQueryClient();
	const { token } = useAuth();
	return useMutation<IDList, Error, SaveBuildingsInput>({
		mutationKey: ["buildings", "save"],
		mutationFn: async (data: SaveBuildingsInput) =>
			await fetchClient("/api/buildings", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: token ? `Bearer ${token}` : "",
				},
				body: JSON.stringify(data),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["buildings", "saved"] });
			queryClient.invalidateQueries({ queryKey: ["recommendations"] });
		},
	});
};

export default useSaveBuildings;
