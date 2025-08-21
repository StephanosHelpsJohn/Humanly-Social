import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: string;
  email: string;
  role: string;
  tenantSlug: string;
  iat: number;
  exp: number;
}

// Making the component async to handle the cookie logic
export default async function DashboardPage() {
    // Per the build error, we must treat cookies() as async and await it.
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    let user: UserPayload | null = null;
    if (token && process.env.JWT_SECRET) {
        try {
            user = jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
        } catch (error) {
            console.error('JWT verification failed:', error);
        }
    }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-off-white p-8">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="font-recoleta text-4xl font-black text-deep-space">
          Welcome to your Dashboard
        </h1>
        {user ? (
            <div className="mt-6 text-left text-deep-space/80 space-y-2">
                <p><strong className="font-semibold text-deep-space">Email:</strong> {user.email}</p>
                <p><strong className="font-semibold text-deep-space">Role:</strong> {user.role}</p>
                <p><strong className="font-semibold text-deep-space">Tenant:</strong> {user.tenantSlug}</p>
            </div>
        ) : (
            <p className="mt-6 text-red-600">Could not load user information. You might not be logged in or your session is invalid.</p>
        )}
      </div>
    </main>
  );
}
