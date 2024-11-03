import prisma from "@/lib/db.connect";
import signUpSchema from "@/schemas/signup.schema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  // add erro when user does not send anything
  try {
    const { fullname, email, password } = await req.json();

    const validation = signUpSchema.safeParse({ fullname, email, password });

    if (!validation.success) {
      const fullnameValidationErrorMessage =
        validation.error?.format().fullname?._errors[0];

      if (fullnameValidationErrorMessage) {
        return NextResponse.json(
          {
            success: false,
            message: fullnameValidationErrorMessage,
          },
          { status: 400 }
        );
      }
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

    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExist) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exist!",
        },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullname,
        email,
        password: hashedPassword,
      },
    });

    user.password = "";
    return NextResponse.json(
      {
        success: true,
        message: "Registration successfully!",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error during signup account!",
      },
      { status: 400 }
    );
  }
}
