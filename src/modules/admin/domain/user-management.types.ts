export const ADMIN_USER_ROLES = ["ADMIN", "EXAMINER", "STUDENT"] as const;
export const ADMIN_USER_STATUSES = ["ACTIVE", "INACTIVE"] as const;

export type AdminUserRole = (typeof ADMIN_USER_ROLES)[number];
export type AdminUserStatus = (typeof ADMIN_USER_STATUSES)[number];

export type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  department: string;
  lastActiveAt: Date;
};

export type AdminUserListFilters = {
  query?: string;
  role?: AdminUserRole | "ALL";
  status?: AdminUserStatus | "ALL";
};

export type AdminUserListSummary = {
  total: number;
  visible: number;
  activeCount: number;
  inactiveCount: number;
  adminCount: number;
  examinerCount: number;
  studentCount: number;
};
