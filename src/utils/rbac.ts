import type { UserRole } from "@/router";

// Define permissions for each role
export const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "view:dashboard",
    "view:students",
    "edit:students",
    "view:analytics",
    "view:courses",
    "edit:courses",
    "view:assignments",
    "edit:assignments",
    "view:settings",
    "edit:settings",
    "view:admin",
    "manage:users",
    "manage:system",
  ],
  teacher: [
    "view:dashboard",
    "view:students",
    "edit:students",
    "view:courses",
    "edit:courses",
    "view:assignments",
    "edit:assignments",
    "view:settings",
  ],
  student: [
    "view:dashboard",
    "view:courses",
    "view:assignments",
    "submit:assignments",
    "view:settings",
  ],
};

/**
 * Check if a user has a specific permission
 */
export function hasPermission(
  userRole: UserRole | undefined,
  permission: string
): boolean {
  if (!userRole) return false;
  return rolePermissions[userRole]?.includes(permission) || false;
}

/**
 * Check if a user has any of the specified permissions
 */
export function hasAnyPermission(
  userRole: UserRole | undefined,
  permissions: string[]
): boolean {
  if (!userRole) return false;
  return permissions.some((permission) => hasPermission(userRole, permission));
}

/**
 * Check if a user has all of the specified permissions
 */
export function hasAllPermissions(
  userRole: UserRole | undefined,
  permissions: string[]
): boolean {
  if (!userRole) return false;
  return permissions.every((permission) => hasPermission(userRole, permission));
}

/**
 * Get all permissions for a specific role
 */
export function getPermissionsForRole(role: UserRole): string[] {
  return rolePermissions[role] || [];
}
