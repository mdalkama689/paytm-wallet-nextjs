import { z } from "zod";

const signInSchema = z.object({
  email: z.string().min(1, {message: "Email is required!"}),
  password: z.string().min(1, {message: 'Password is required!'}),
});

export default signInSchema;
