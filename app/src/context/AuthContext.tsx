import type { User } from "@supabase/supabase-js";
import { createContext } from "react";

type AuthContextType = {
	user: User | null;
	token: string | null;
	clickedSignOut: boolean;
	setClickedSignOut: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType>({
	user: null,
	token: null,
	clickedSignOut: false,
	setClickedSignOut: () => {},
});
