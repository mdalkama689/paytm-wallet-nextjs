import signInSchema from "@/schemas/signin.schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/db.connect";
import jwt from "jsonwebtoken";
import { log } from "console";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { email, password } = await req.json();

    const validation = signInSchema.safeParse({ email, password });

    if (!validation.success) {
      const emailValidationErrorMessage =
        validation.error?.format().email?._errors[0];

      if (emailValidationErrorMessage) {
        return NextResponse.json(
          {
            success: false,
            message: emailValidationErrorMessage,
          },
          { status: 400 }
        );
      }

      const passwordValidationErrorMessage =
        validation.error?.format().password?._errors[0];

      if (passwordValidationErrorMessage) {
        return NextResponse.json(
          {
            success: false,
            message: passwordValidationErrorMessage,
          },
          { status: 400 }
        );
      }
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 400 }
      );
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid credentials",
        },
        { status: 400 }
      );
    }

    const payload = {
      id: user.id,
    };

    const JWT_SECRET = process.env.JWT_SECRET;
    const token = await jwt.sign(payload, JWT_SECRET!, { expiresIn: "7d" });

    user.password = "";

    const response = NextResponse.json(
      {
        success: true,
        message: "Signin successfully!",
        user,
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error during signin",
      },
      { status: 400 }
    );
  }
}
