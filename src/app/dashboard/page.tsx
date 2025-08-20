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

const getUser = () => {
  const token = cookies().get('auth_token')?.value;
  if (!token || !process.env.JWT_SECRET) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};


export default function DashboardPage() {
    const user = getUser();

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
            <p className="mt-6 text-red-600">Could not load user information. You might not be logged in.</p>
        )}
      </div>
    </main>
  );
}
