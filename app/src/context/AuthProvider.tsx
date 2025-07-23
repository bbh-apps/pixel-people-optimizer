import { useEffect, useState } from "react";
import { getInitialSession } from "../lib/authUtils";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const initialSession = getInitialSession();
	const [user, setUser] = useState(initialSession?.user ?? null);
	const [token, setToken] = useState(initialSession?.access_token ?? null);
	const [clickedSignOut, setClickedSignOut] = useState(false);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session) {
				setUser(session.user);
				setToken(session.access_token);
			}
		});

		const { data: subscription } = supabase.auth.onAuthStateChange(
			(_event, session) => {
				if (session) {
					setUser(session.user);
					setToken(session.access_token);
					localStorage.setItem("supabase.session", JSON.stringify(session));
				} else {
					setUser(null);
					setToken(null);
					localStorage.removeItem("supabase.session");
				}
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
