import configs from '@/configs'
import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Create Supabase Client
  const supabase = createServerClient(configs.SUPABASE_URL!, configs.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        cookiesToSet.forEach(({ name, value, options: _options }) => response.cookies.set(name, value, _options))
      },
    },
  })

  // 2. Get User
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 3. Define Protected Routes

  // If user is logged in and tries to access auth pages, redirect to home.
  if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register'))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is NOT logged in and tries to access protected routes (like dashboard if we had one, or if admin pages are separated).
  // For now, let's say we don't have a strict dashboard route yet, but if we did:
  // if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }

  return response
}
