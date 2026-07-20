import { registerSchema } from "@/schemas/auth.schema";
import { z } from "zod";

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type RegisterStep = 1 | 2 | 3;
