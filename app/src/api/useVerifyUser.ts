import { useMutation } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { AuthenticatedReq } from "./useAuth";

const useVerifyUser = () => {
	return useMutation({
		mutationKey: ["auth", "me"],
		mutationFn: async (data: AuthenticatedReq) =>
			await fetchClient("/auth/me", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: data.token ? `Bearer ${data.token}` : "",
				},
				body: JSON.stringify(data),
			}),
	});
};

export default useVerifyUser;
