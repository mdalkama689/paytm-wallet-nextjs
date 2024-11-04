import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function getDatafromToken(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value || "";
    console.log("token in getDatafromToken 7: ", token.length);

    if (!token || !token.trim() || token.length === 0) {
    throw new Error('unautheticated')
    }
    const JWT_SECRET = process.env.JWT_SECRET;
    console.log("jwt in get data from token : ", JWT_SECRET);

    const decodeToken = await jwt.verify(token, JWT_SECRET!);
    if (!decodeToken) {
        throw new Error('unautheticated')
    }
    return decodeToken?.id;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid or expired token!",
      },
      { status: 400 }
    );
  }
}
