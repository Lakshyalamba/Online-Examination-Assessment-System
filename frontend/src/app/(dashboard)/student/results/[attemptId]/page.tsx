import Link from "next/link";

import {
  getStudentResult,
  requireApiUser,
} from "@/lib/server/assessment-service";

type StudentResultPageProps = {
  params: Promise<{ attemptId: string }>;
};

export default async function StudentResultPage({
  params,
}: StudentResultPageProps) {
  const { attemptId } = await params;
  const user = await requireApiUser(["STUDENT"]);
  const result = await getStudentResult(user, attemptId);

  return (
    <div className="student-record-workspace">
      <section className="surface-card student-record-hero">
        <p className="surface-card__eyebrow">Result</p>
        <h2>{result.title}</h2>
        <p>{result.code}</p>
      </section>
      <section className="surface-card student-detail-card">
        <span className={`student-status-chip ${result.passed === false ? "student-status-chip--expired" : "student-status-chip--attempted"}`}>
          {result.passed === null ? "result published" : result.passed ? "pass" : "fail"}
        </span>
        <div className="student-result-score">
          <span>Score obtained</span>
          <strong>{result.score} / {result.totalMarks}</strong>
          <p>{result.percentage.toFixed(2)}%</p>
        </div>
        <div className="student-metric-grid">
          <div><span>Correct</span><strong>{result.correctCount}</strong></div>
          <div><span>Incorrect</span><strong>{result.incorrectCount}</strong></div>
          <div><span>Attempted</span><strong>{result.attemptedCount}</strong></div>
          <div><span>Unattempted</span><strong>{result.unattemptedCount}</strong></div>
        </div>
        <div className="student-detail-window">
          <span>Submitted</span>
          <strong>
            {result.submittedAt
              ? new Date(result.submittedAt).toLocaleString()
              : "Unavailable"}
          </strong>
        </div>
        <Link className="button-link" href="/dashboard/student/results">
          Back to results
        </Link>
      </section>
    </div>
  );
}
