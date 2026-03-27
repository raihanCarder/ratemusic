import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

async function getProxyUser(request: NextRequest, response: NextResponse) {
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
    },
  );

  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  return user;
}

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  try {
    const user = await getProxyUser(request, response);

    if (user) {
      const url = request.nextUrl.clone();
      url.pathname = "/feed";
      return NextResponse.redirect(url);
    }
  } catch (error) {
    console.debug(
      "Auth proxy check:",
      error instanceof Error ? error.message : String(error),
    );
  }

  return response;
}

export const config = {
  matcher: ["/signin/:path*", "/signup/:path*"],
};

