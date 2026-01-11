import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

async function getUser(request: NextRequest, response: NextResponse) {
  const supabaseClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  return user;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });
  const user = await getUser(request, response);

  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/signin" ||
    pathname === "/signup" ||
    pathname.startsWith("/signin/") ||
    pathname.startsWith("/signup/");

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/feed";
    return NextResponse.redirect(url);
  }

  return response;
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
