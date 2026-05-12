/**
 * Admin presence state stored on globalThis so it is shared across ALL module
 * instances in the same Node.js process — both the tsx-loaded socket server and
 * the webpack-bundled Next.js API routes get the same underlying Set.
 */

const g = globalThis as typeof globalThis & { __chatAdmins?: Set<string> };

function admins(): Set<string> {
  if (!g.__chatAdmins) g.__chatAdmins = new Set<string>();
  return g.__chatAdmins;
}

export function addAdmin(socketId: string) {
  admins().add(socketId);
}

export function removeAdmin(socketId: string) {
  admins().delete(socketId);
}

export function getAdminCount(): number {
  return admins().size;
}

export function isOnline(): boolean {
  return admins().size > 0;
}
