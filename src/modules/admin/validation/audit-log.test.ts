import assert from "node:assert/strict";
import test from "node:test";

import {
  describeAdminAuditAction,
  listAdminAuditRecords,
  sortAdminAuditRecords,
} from "../index.ts";

test("admin audit records keep the required row fields stable", () => {
  const records = listAdminAuditRecords();

  assert.equal(records.length >= 1, true);
  assert.deepEqual(Object.keys(records[0] ?? {}).sort(), [
    "action",
    "actor",
    "entity",
    "entityType",
    "id",
    "occurredAt",
  ]);
});

test("admin audit records sort newest-first for readable table rendering", () => {
  const sorted = sortAdminAuditRecords(listAdminAuditRecords());

  assert.equal(sorted[0]?.id, "audit-001");
  assert.equal(sorted.at(-1)?.id, "audit-005");
});

test("admin audit action labels stay readable for table rows", () => {
  assert.equal(describeAdminAuditAction("USER_CREATED"), "User created");
  assert.equal(describeAdminAuditAction("AUDIT_EXPORT_REQUESTED"), "Audit export requested");
});
