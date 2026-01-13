import configs from '@/configs'
import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(configs.SUPABASE_URL!, configs.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options: _options }) => response.cookies.set(name, value, _options))
      },
    },
  })

  // Refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Dashboard Access Protection
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!user) {
      console.log('Middleware: No user found, redirecting to /login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check if user has ADMIN role
    const role = user.user_metadata?.role
    console.log(`Middleware: User ${user.email} has role: ${role}`)
    console.log('Middleware: Full User Metadata:', JSON.stringify(user.user_metadata))

    if (role !== 'ADMIN') {
      console.log('Middleware: User is not ADMIN, redirecting to /')
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // If user is logged in and tries to access auth pages, redirect to home.
  if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
