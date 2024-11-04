import { NextRequest, NextResponse } from "next/server";

export  async function middleware (req: NextRequest){
    const path = req.nextUrl.pathname
    console.log('path in middlware : ', path);

    const isPublicPath = path === '/sign-up' || path === '/sign-in'

    console.log('is public path in midllwares : ', isPublicPath);

    const token = req.cookies.get('token')?.value || ""

    console.log('token : ', token);

if(isPublicPath && token){
    return NextResponse.redirect(new URL('/', req.nextUrl))
}

if(!isPublicPath && !token){
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl))
}

return NextResponse.next()

}

export const config = {
    matcher: [
        '/',
        '/:path*'
    ]
}