import { z } from "zod";

const fullnameRegex = /^(?=.{5,30}$)[A-Z][a-z]+ [A-Z][a-z]+$/;

const signUpSchema = z.object({
  fullname: z.string().regex(fullnameRegex, {
    message:
      "Full name must be 5-30 characters, contain two words separated by a space, and each word should start with a capital letter.",
  }),
  email: z.string().email({ message: "Invalid email format!" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." }),
});

export default signUpSchema;
