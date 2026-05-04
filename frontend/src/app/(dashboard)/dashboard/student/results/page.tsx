import Link from "next/link";

import {
  listStudentResults,
  requireApiUser,
} from "@/lib/server/assessment-service";

export default async function StudentResultsPage() {
  const user = await requireApiUser(["STUDENT"]);
  const results = await listStudentResults(user);

  return (
    <div className="student-record-workspace">
      <section className="surface-card student-record-hero">
        <p className="surface-card__eyebrow">Results</p>
        <h2>Submitted exam results</h2>
      </section>
      <section className="surface-card student-record-section">
        <div className="student-record-list">
          {results.length === 0 ? (
            <p className="student-record-empty">No published results are available yet.</p>
          ) : (
            results.map((result) => (
              <article className="student-record-card" key={result.attemptId}>
                <div className="student-record-card__header">
                  <div>
                    <p className="student-record-code">{result.code}</p>
                    <h3>{result.title}</h3>
                  </div>
                  <span className="student-status-chip student-status-chip--attempted">
                    submitted
                  </span>
                </div>
                <div className="student-metric-grid">
                  <div><span>Score</span><strong>{result.score} / {result.totalMarks}</strong></div>
                  <div><span>Percentage</span><strong>{result.percentage.toFixed(2)}%</strong></div>
                  <div><span>Correct</span><strong>{result.correctCount}</strong></div>
                  <div><span>Attempted</span><strong>{result.attemptedCount}</strong></div>
                </div>
                <Link className="button-link" href={`/student/results/${result.attemptId}`}>
                  View result
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
