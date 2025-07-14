import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Für jetzt: Einfache Test-Authentication
    if (email === 'admin@aanexa.com' && password === 'admin123!') {
      return NextResponse.json({ 
        success: true, 
        message: 'Login successful' 
      })
    } else {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
