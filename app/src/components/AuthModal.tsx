import { Button, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAuth } from "../api/useAuth";
import useVerifyUser from "../api/useVerifyUser";
import { usePendingSaveGameData } from "../hooks/usePendingSaveGameData";
import { supabase } from "../lib/supabaseClient";

const AuthModal = ({
	opened,
	onClose,
}: {
	opened: boolean;
	onClose: () => void;
}) => {
	const { clickedSignOut } = useAuth();
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const [step, setStep] = useState<"email" | "token">("email");
	const { submitAllPendingSaves } = usePendingSaveGameData();
	const { mutate: verifyUser, isPending } = useVerifyUser();

	const handleSendOtp = async () => {
		await supabase.auth.signInWithOtp({ email });
		setStep("token");
	};

	const handleVerify = async () => {
		try {
			const { data, error } = await supabase.auth.verifyOtp({
				email,
				token: code,
				type: "email",
			});

			if (error || !data?.session) {
				console.error("OTP verification failed:", error);
				return;
			}
		} catch (err) {
			console.error("Unexpected error verifying OTP:", err);
		}
	};

	useEffect(() => {
		const { data: listener } = supabase.auth.onAuthStateChange(
			async (event, session) => {
				if (event === "SIGNED_IN" && session?.access_token) {
					verifyUser(
						{ token: session.access_token },
						{
							onSuccess: (res) => {
								if (res.is_new_account) {
									submitAllPendingSaves();
								}
								onClose();
							},
							onError: (err) => console.error(err),
						}
					);
				}
			}
		);

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (clickedSignOut) {
			setEmail("");
			setCode("");
			setStep("email");
		}
	}, [clickedSignOut]);

	return (
		<Modal opened={opened} onClose={onClose} title="Sign In / Sign Up">
			{step === "email" ? (
				<Stack>
					<Text size="sm">Sign in / up to save your game data!</Text>
					<TextInput
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
						label="Email"
					/>
					<Button mt="md" onClick={handleSendOtp}>
						Send code to email
					</Button>
				</Stack>
			) : (
				<Stack>
					<Text size="sm">
						Check your email for the 6-digit code and enter below.
					</Text>
					<TextInput
						value={code}
						onChange={(e) => setCode(e.currentTarget.value)}
						label="Enter code"
					/>
					<Button mt="md" onClick={handleVerify} loading={isPending}>
						Verify code & sign in
					</Button>
				</Stack>
			)}
		</Modal>
	);
};

export default AuthModal;
