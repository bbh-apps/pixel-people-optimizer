import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export type AuthenticatedReq = { token: string };

export const useAuth = () => useContext(AuthContext);
