import { useEffect, useState } from "react";

export default function useDelayedLoading(
	isLoading: boolean,
	delay: number = 300
) {
	const [showLoading, setShowLoading] = useState(isLoading);

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		if (!isLoading) {
			// Delay hiding the loading state
			timeout = setTimeout(() => setShowLoading(false), delay);
		} else {
			// Immediately show loading when true
			setShowLoading(true);
		}

		return () => clearTimeout(timeout);
	}, [isLoading, delay]);

	return showLoading;
}
