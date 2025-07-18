const BASE_URL = import.meta.env.VITE_API_URL;

type FetchOptions = RequestInit & {
	headers?: Record<string, string>;
};

export async function fetchClient<T>(
	endpoint: string,
	options: FetchOptions = {}
): Promise<T> {
	const url = `${BASE_URL}${endpoint}`;

	const res = await fetch(url, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...(options.headers || {}),
		},
	});

	if (!res.ok) {
		const errorText = await res.text();
		throw new Error(`Error ${res.status}: ${errorText}`);
	}

	return res.json();
}
