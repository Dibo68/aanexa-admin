import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    })
    
    // Clear any auth cookies (für später wenn wir JWT haben)
    response.cookies.set('admin-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    })

    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
