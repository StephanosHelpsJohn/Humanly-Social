import { PrismaClient } from '@prisma/client';

// It's recommended to use a global object to store the Prisma client in development
// to avoid creating too many connections during hot-reloading.
const globalForPrisma = global as unknown as {
  controlPlaneClient?: PrismaClient;
};

// This is the client for the main "control plane" database that stores tenant metadata.
export const controlPlaneClient =
  globalForPrisma.controlPlaneClient ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.controlPlaneClient = controlPlaneClient;
}

// We'll use a Map to cache Prisma client instances for each tenant.
const tenantClients = new Map<string, PrismaClient>();

/**
 * Gets a Prisma client for a specific tenant.
 * It will cache the client instance to avoid creating new connections for every request.
 * @param tenantSlug The slug of the tenant.
 * @returns A PrismaClient instance connected to the tenant's database.
 */
export async function getTenantPrismaClient(tenantSlug: string): Promise<PrismaClient> {
  // Check if a client for this tenant is already cached.
  const cachedClient = tenantClients.get(tenantSlug);
  if (cachedClient) {
    return cachedClient;
  }

  // If not cached, fetch the tenant's connection details from the control plane database.
  const tenant = await controlPlaneClient.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (!tenant) {
    throw new Error(`Tenant with slug "${tenantSlug}" could not be found.`);
  }

  // In a real production environment, the `dbSecretArn` would be used to fetch the
  // database password from AWS Secrets Manager. For now, as a placeholder, we'll
  // assume the secret ARN field contains the password directly.
  // This is NOT secure and is for initial development purposes only.
  const dbPassword = tenant.dbSecretArn;
  const dbHost = process.env.TENANT_DB_HOST || 'localhost';
  const dbPort = process.env.TENANT_DB_PORT || '5432';

  const tenantDatabaseUrl = `postgresql://${tenant.dbUser}:${dbPassword}@${dbHost}:${dbPort}/${tenant.dbName}?schema=public`;

  // Create a new Prisma client instance for the tenant's database.
  const newTenantClient = new PrismaClient({
    datasources: {
      db: {
        url: tenantDatabaseUrl,
      },
    },
  });

  // Cache the new client for future requests.
  tenantClients.set(tenantSlug, newTenantClient);

  return newTenantClient;
}
