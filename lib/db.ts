import { PrismaClient } from '@prisma/client';

// declare global {
//   // allow global `var` declarations
//   // eslint-disable-next-line no-var
//   var prisma: PrismaClient | undefined;
// }

// export const db = globalThis.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;
// import { PrismaClient } from '@repo/database';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient;
}

const db: PrismaClient =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
}

export { db };
