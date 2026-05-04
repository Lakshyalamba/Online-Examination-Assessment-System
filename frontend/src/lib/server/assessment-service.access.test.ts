import assert from "node:assert/strict";
import test from "node:test";

import {
  canManageAssessmentRecord,
  canWriteAssessments,
} from "./assessment-service";

test("admin can create and manage any question or exam", () => {
  const admin = { id: "admin-1", role: "ADMIN" as const };

  assert.equal(canWriteAssessments(admin), true);
  assert.equal(canManageAssessmentRecord(admin, "examiner-1"), true);
});

test("examiner can create and manage only owned question or exam records", () => {
  const examiner = { id: "examiner-1", role: "EXAMINER" as const };

  assert.equal(canWriteAssessments(examiner), true);
  assert.equal(canManageAssessmentRecord(examiner, "examiner-1"), true);
  assert.equal(canManageAssessmentRecord(examiner, "examiner-2"), false);
});

test("student cannot create or manage question and exam records", () => {
  const student = { id: "student-1", role: "STUDENT" as const };

  assert.equal(canWriteAssessments(student), false);
  assert.equal(canManageAssessmentRecord(student, "student-1"), false);
  assert.equal(canManageAssessmentRecord(student, "examiner-1"), false);
});
