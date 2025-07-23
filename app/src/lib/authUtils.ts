import type { Session } from "@supabase/supabase-js";

export function getInitialSession(): Session | null {
	try {
		const raw = localStorage.getItem("supabase.session");
		if (!raw) return null;
		const session: Session = JSON.parse(raw);
		// Optional: add expiry check if you want
		return session;
	} catch {
		return null;
	}
}
