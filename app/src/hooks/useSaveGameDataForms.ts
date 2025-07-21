import { create } from "zustand";

type SaveCallback = () => Promise<void>;

type SaveGameDataFormsState = {
	registerSaveCallback: (formKey: string, cb: SaveCallback) => void;
	unregisterSaveCallback: (formKey: string) => void;
	triggerSaveAll: () => Promise<void>;
};

export const useSaveGameDataForms = create<SaveGameDataFormsState>(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	(_set, _get) => {
		const callbacks = new Map<string, SaveCallback>();

		return {
			registerSaveCallback: (formKey, cb) => {
				callbacks.set(formKey, cb);
			},
			unregisterSaveCallback: (formKey) => {
				callbacks.delete(formKey);
			},
			triggerSaveAll: async () => {
				const promises = Array.from(callbacks.values()).map((cb) => cb());
				await Promise.all(promises);
			},
		};
	}
);
