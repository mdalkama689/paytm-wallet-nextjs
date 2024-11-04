import { getDatafromToken } from "@/helpers/getDataFromToken";
import prisma from "@/lib/db.connect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const userId = await getDatafromToken(req);

    if (userId?.status >= 400) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthenticated or invalid token, please login to continue!",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Profile fetching successfully!",
        user,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error during fetching profile!",
      },
      { status: 400 }
    );
  }
}
