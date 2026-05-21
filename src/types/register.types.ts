import { registerCoreSchema } from "@/lib/register-core.schema";
import { z } from "zod";

export type RegisterFormValues = z.infer<typeof registerCoreSchema>;

export type RegisterStep = 1 | 2 | 3;
