import type { Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [clickedSignOut, setClickedSignOut] = useState<boolean>(false);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session) {
				setUser(session.user);
				setToken(session.access_token);
			}
		});

		const { data: subscription } = supabase.auth.onAuthStateChange(
			(_event: string, session: Session | null) => {
				setTimeout(async () => {
					if (session) {
						setUser(session.user);
						setToken(session.access_token);
					} else {
						setUser(null);
						setToken(null);
					}
				}, 0);
			}
		);
		return () => subscription.subscription.unsubscribe();
	}, []);

	return (
		<AuthContext.Provider
			value={{ user, token, clickedSignOut, setClickedSignOut }}
		>
			{children}
		</AuthContext.Provider>
	);
};
