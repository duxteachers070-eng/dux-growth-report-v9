import assert from "node:assert/strict";
import test from "node:test";
import { randomReportId, validateReport } from "../lib/report-validation.js";

const report = {
  student: "김서윤",
  campus: "평촌",
  teacher: "Jennifer",
  level: "10000",
  period: "2026 2nd Term",
  skills: [
    { id: "reading", label: "Reading", korean: "리딩", previous: 78, current: 84, weight: 20 },
  ],
  diagnosis: "간결한 종합 분석",
};

test("accepts a valid report and rejects malformed data", () => {
  assert.equal(validateReport(report), true);
  assert.equal(validateReport({ ...report, student: "" }), false);
  assert.equal(validateReport({ ...report, skills: [{ ...report.skills[0], current: 101 }] }), false);
  assert.equal(validateReport({ ...report, constructor: "unsafe" }), false);
});

test("creates non-enumerable 48-character report ids", () => {
  const ids = new Set(Array.from({ length: 100 }, () => randomReportId()));
  assert.equal(ids.size, 100);
  for (const id of ids) assert.match(id, /^[a-f0-9]{48}$/);
});
