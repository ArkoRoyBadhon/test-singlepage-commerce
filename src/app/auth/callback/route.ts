import { prisma } from '@/libs/prisma/client'
import { createServerSupabaseClient } from '@/libs/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Ensure user exists in Prisma database
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ supabaseId: data.user.id }, { email: data.user.email! }],
        },
      })

      if (!existingUser) {
        // Create user if doesn't exist
        const placeholderPhone = `temp-${data.user.id}`
        await prisma.user.create({
          data: {
            supabaseId: data.user.id,
            email: data.user.email!,
            role: 'USER',
            phone: placeholderPhone,
            name: data.user.email!.split('@')[0],
          },
        })
      } else if (!existingUser.supabaseId) {
        // Link existing user
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { supabaseId: data.user.id },
        })
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
