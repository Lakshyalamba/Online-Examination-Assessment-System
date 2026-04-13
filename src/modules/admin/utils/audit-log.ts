import type { AdminAuditAction, AdminAuditRecord } from "../domain/audit-log.types.ts";

export const listAdminAuditRecords = (): AdminAuditRecord[] => [
  {
    id: "audit-001",
    actor: "Abhishek Rana",
    action: "USER_CREATED",
    entity: "Isha Nair",
    entityType: "USER",
    occurredAt: new Date("2026-04-13T10:12:00.000Z"),
  },
  {
    id: "audit-002",
    actor: "Meera Joshi",
    action: "ROLE_UPDATED",
    entity: "Priya Singh",
    entityType: "USER",
    occurredAt: new Date("2026-04-13T09:48:00.000Z"),
  },
  {
    id: "audit-003",
    actor: "Abhishek Rana",
    action: "STATUS_UPDATED",
    entity: "Sonia Malhotra",
    entityType: "USER",
    occurredAt: new Date("2026-04-13T09:31:00.000Z"),
  },
  {
    id: "audit-004",
    actor: "Meera Joshi",
    action: "EXAM_PUBLISHED",
    entity: "Database Systems Midterm",
    entityType: "EXAM",
    occurredAt: new Date("2026-04-13T08:54:00.000Z"),
  },
  {
    id: "audit-005",
    actor: "Abhishek Rana",
    action: "AUDIT_EXPORT_REQUESTED",
    entity: "Weekly Governance Summary",
    entityType: "REPORT",
    occurredAt: new Date("2026-04-12T16:22:00.000Z"),
  },
];

export const sortAdminAuditRecords = (
  records: readonly AdminAuditRecord[],
): AdminAuditRecord[] =>
  [...records].sort((left, right) => right.occurredAt.getTime() - left.occurredAt.getTime());

export const describeAdminAuditAction = (action: AdminAuditAction): string => {
  switch (action) {
    case "USER_CREATED":
      return "User created";
    case "ROLE_UPDATED":
      return "Role updated";
    case "STATUS_UPDATED":
      return "Status updated";
    case "EXAM_PUBLISHED":
      return "Exam published";
    case "AUDIT_EXPORT_REQUESTED":
      return "Audit export requested";
  }
};
