// imports the schema through the barrel file, not "@/entities/User"
import { UserSchema } from "@/entities/User";

export const formUserSchema = UserSchema.pick({ name: true });
