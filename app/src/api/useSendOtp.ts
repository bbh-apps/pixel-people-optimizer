import { useMutation } from "@tanstack/react-query";
import { fetchClient } from "../lib/fetchClient";
import type { OTPReq } from "../types/models";

const useSendOtp = () => {
	return useMutation({
		mutationKey: ["auth", "sign_in"],
		mutationFn: async (data: OTPReq) =>
			await fetchClient("/auth/otp", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			}),
	});
};

export default useSendOtp;
