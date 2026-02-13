// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//   const accessToken = req.cookies.get("server_access_token");

//   // This will now only log for actual page loads/API calls
//   console.log("Checking access for:", req.nextUrl.pathname);

//   if (accessToken) {
//     const headers = new Headers(req.headers);
//     headers.set("Authorization", `Bearer ${accessToken.value}`); // Use .value!

//     return NextResponse.next({
//       request: { headers },
//     });
//   }

//   // If no token, just continue (or redirect to /login)
//   return NextResponse.next();
// }

// // THIS IS THE MISSING PIECE
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!_next/static|_next/image|favicon.ico).*)",
//   ],
// };

import { cookies } from "next/headers";
import { NextResponse, userAgent } from "next/server";
import type { NextRequest } from "next/server";
import {
  protectProxy,
  refreshTokenProxy,
} from "./lib/services/frontend/proxy-token-utils";
import { setAuthCookies } from "./lib/utils/cookies.util";
import { ms } from "./lib/utils/util";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  //   return NextResponse.redirect(new URL("/home", request.url));

  const ua = userAgent(request);
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0] || "";

  console.log(ua);
  const data = await protectProxy();
  console.log(data, "...");
  let response = NextResponse.next();
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY;
  const accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY;
  if (
    refreshTokenExpiry &&
    accessTokenExpiry &&
    data.status === "error" &&
    data.errorCode === "ERR_TOKEN_EXPIRE" &&
    refreshToken
  ) {
    const data = await refreshTokenProxy({
      device: ua?.device.type || "",
      browser: ua?.browser?.name || "",
      ip,
      os: ua?.os?.name || "",
      osVersion: ua?.os?.version || "",
      refreshToken: refreshToken || "",
    });
    if (data.accessToken && data.refreshToken) {
      response = setAuthCookies(response, {
        accessToken: {
          value: data.accessToken,
          maxAge: ms(accessTokenExpiry), // e.g., 15 minutes
        },
        refreshToken: {
          value: data.refreshToken,
          maxAge: ms(refreshTokenExpiry), // e.g., 7 days
        },
      });
    }
  }

  return response;
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: "/",
};
