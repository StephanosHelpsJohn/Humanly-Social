import { NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { controlPlaneClient } from '@/lib/prisma';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
});

// A simple slugify function
const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = signupSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: 'Invalid input.', errors: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;

    // Check if user already exists
    const existingUser = await controlPlaneClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists.' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // For simplicity, we'll create a new tenant for each new user signup.
    // In a real-world scenario, this might be handled by invites.
    // The dbUser and dbSecretArn would be generated and stored securely.
    // Here we use placeholders.
    const tenantSlug = slugify(name) + '-' + Math.random().toString(36).substring(2, 8);
    const newTenant = await controlPlaneClient.tenant.create({
      data: {
        name: `${name}'s Organization`,
        slug: tenantSlug,
        dbName: `tenant_${tenantSlug.replace(/-/g, '_')}`,
        dbUser: `user_${tenantSlug.replace(/-/g, '_')}`,
        dbSecretArn: 'placeholder_secret_arn', // This would be a real ARN in production
      },
    });

    // Create the new user and link them to the tenant
    const newUser = await controlPlaneClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ORG_OWNER',
        tenantId: newTenant.id,
      },
    });

    return NextResponse.json(
      { message: 'User created successfully.', userId: newUser.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup Error:', error);
    // Check for unique constraint violation on slug
    if (error instanceof Error && error.message.includes('Unique constraint failed on the fields: (`slug`)')) {
        return NextResponse.json({ message: 'An organization with a similar name already exists. Please try a different name.' }, { status: 409 });
    }
    return NextResponse.json(
      { message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
