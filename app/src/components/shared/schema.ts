import { z } from "zod";

export const saveEntitySchema = z.object({
	ids: z.array(z.number()),
});

export type SaveBuildingsInput = z.infer<typeof saveEntitySchema>;
export type SaveProfessionsInput = z.infer<typeof saveEntitySchema>;
export type SaveMissionsInput = z.infer<typeof saveEntitySchema>;

export const recommendationsSchema = z.object({
	remaining_land: z.number(),
});

export type RecommendationsInput = z.infer<typeof recommendationsSchema>;
