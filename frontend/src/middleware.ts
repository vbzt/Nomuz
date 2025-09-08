import { NextRequest, NextResponse } from "next/server";


export default function middleware(req: NextRequest ){ 
  const token = req.cookies.get('jwt')?.value
  
  const isAuth = !!token
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

  if (!isAuth && !isAuthPage) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname); 

    return NextResponse.redirect(new URL("/auth/login", req.url))
  }
  if (isAuth && isAuthPage) return NextResponse.redirect(new URL("/dashboard", req.url))

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"], 
};