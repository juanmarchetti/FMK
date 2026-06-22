import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — MUST NOT be removed
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Public routes that don't require auth
  const publicRoutes = ['/login']
  if (publicRoutes.includes(pathname)) {
    // If already logged in, redirect to appropriate dashboard
    if (user) {
      const { data: profile } = await supabase
        .from('perfiles_usuario')
        .select('rol')
        .eq('user_id', user.id)
        .single()

      if (profile?.rol === 'administrador') {
        return NextResponse.redirect(new URL('/admin', request.url))
      } else if (profile?.rol === 'director_fmk') {
        return NextResponse.redirect(new URL('/director', request.url))
      } else if (profile?.rol === 'aspirante') {
        return NextResponse.redirect(new URL('/aspirante', request.url))
      }
    }
    return supabaseResponse
  }

  // Protected routes — redirect to login if not authenticated
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Role-based access control
  const { data: profile } = await supabase
    .from('perfiles_usuario')
    .select('rol, estado')
    .eq('user_id', user.id)
    .single()

  // Suspended users get kicked out
  if (profile?.estado === 'suspendido') {
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const rol = profile?.rol

  // Admin routes — only 'administrador' can access
  if (pathname.startsWith('/admin') && rol !== 'administrador') {
    if (rol === 'director_fmk') return NextResponse.redirect(new URL('/director', request.url))
    if (rol === 'aspirante') return NextResponse.redirect(new URL('/aspirante', request.url))
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Director routes — only 'director_fmk' can access
  if (pathname.startsWith('/director') && rol !== 'director_fmk') {
    if (rol === 'administrador') return NextResponse.redirect(new URL('/admin', request.url))
    if (rol === 'aspirante') return NextResponse.redirect(new URL('/aspirante', request.url))
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Aspirante routes — only 'aspirante' can access
  if (pathname.startsWith('/aspirante') && rol !== 'aspirante') {
    if (rol === 'administrador') return NextResponse.redirect(new URL('/admin', request.url))
    if (rol === 'director_fmk') return NextResponse.redirect(new URL('/director', request.url))
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static chunks or CSS files (endswith .css or contains /static/)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.css$|.*\\.js$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
