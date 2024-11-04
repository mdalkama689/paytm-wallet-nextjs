import { getDatafromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        success: true,
        message: "Logout successfully!",
      },
      { status: 200 }
    );

    response.cookies.delete("token");
    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Error during logout!",
      },
      { status: 400 }
    );
  }
}
