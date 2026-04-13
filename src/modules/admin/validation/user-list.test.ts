import assert from "node:assert/strict";
import test from "node:test";

import {
  ADMIN_USER_ROLES,
  ADMIN_USER_STATUSES,
  filterAdminUserRecords,
  listAdminUserRecords,
  summarizeAdminUserRecords,
} from "../index.ts";

test("admin user list contracts keep supported role and status filters stable", () => {
  assert.deepEqual(ADMIN_USER_ROLES, ["ADMIN", "EXAMINER", "STUDENT"]);
  assert.deepEqual(ADMIN_USER_STATUSES, ["ACTIVE", "INACTIVE"]);
});

test("admin user list filters by role and status independently and together", () => {
  const users = listAdminUserRecords();

  assert.equal(filterAdminUserRecords(users, { role: "ADMIN" }).length, 2);
  assert.equal(filterAdminUserRecords(users, { status: "INACTIVE" }).length, 2);

  const filtered = filterAdminUserRecords(users, {
    role: "EXAMINER",
    status: "ACTIVE",
  });

  assert.deepEqual(
    filtered.map((user) => user.email),
    ["rahul.verma@college.edu", "ankit.sharma@college.edu"],
  );
});

test("admin user list search matches name or email without case sensitivity", () => {
  const users = listAdminUserRecords();

  assert.deepEqual(
    filterAdminUserRecords(users, { query: "priya" }).map((user) => user.name),
    ["Priya Singh"],
  );

  assert.deepEqual(
    filterAdminUserRecords(users, { query: "ANKIT.SHARMA@" }).map((user) => user.name),
    ["Ankit Sharma"],
  );
});

test("admin user list can resolve to an empty state when filters remove all rows", () => {
  const users = listAdminUserRecords();
  const visible = filterAdminUserRecords(users, {
    role: "ADMIN",
    status: "INACTIVE",
    query: "nobody",
  });

  assert.deepEqual(visible, []);
});

test("admin user summary keeps the full and visible counts readable", () => {
  const users = listAdminUserRecords();
  const visible = filterAdminUserRecords(users, { status: "ACTIVE" });

  assert.deepEqual(summarizeAdminUserRecords(users, visible), {
    total: 8,
    visible: 6,
    activeCount: 6,
    inactiveCount: 2,
    adminCount: 2,
    examinerCount: 3,
    studentCount: 3,
  });
});
