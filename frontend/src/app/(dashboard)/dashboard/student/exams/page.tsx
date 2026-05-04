import Link from "next/link";

import {
  listAssignedExamsForStudent,
  requireApiUser,
} from "@/lib/server/assessment-service";

export default async function StudentExamsPage() {
  const user = await requireApiUser(["STUDENT"]);
  const exams = await listAssignedExamsForStudent(user);

  return (
    <div className="student-record-workspace">
      <section className="surface-card student-record-hero">
        <p className="surface-card__eyebrow">Assigned exams</p>
        <h2>Your exam schedule</h2>
        <p>
          Open an exam to review details, start an available attempt, or view a
          completed result.
        </p>
      </section>

      <section className="surface-card student-record-section">
        <div className="student-record-list">
          {exams.length === 0 ? (
            <p className="student-record-empty">No assigned exams are visible right now.</p>
          ) : (
            exams.map((exam) => (
              <article className="student-record-card" key={exam.assignmentId}>
                <div className="student-record-card__header">
                  <div>
                    <p className="student-record-code">{exam.code}</p>
                    <h3>{exam.title}</h3>
                  </div>
                  <span className={`student-status-chip student-status-chip--${exam.availabilityStatus}`}>
                    {exam.availabilityStatus}
                  </span>
                </div>
                <div className="student-metric-grid">
                  <div><span>Topic</span><strong>{exam.topicName}</strong></div>
                  <div><span>Duration</span><strong>{exam.durationMinutes} min</strong></div>
                  <div><span>Marks</span><strong>{exam.totalMarks}</strong></div>
                  <div><span>Questions</span><strong>{exam.questionCount}</strong></div>
                </div>
                <p className="student-record-window">
                  {new Date(exam.windowStartsAt).toLocaleString()} to{" "}
                  {new Date(exam.windowEndsAt).toLocaleString()}
                </p>
                <Link className="button-link" href={`/student/exams/${exam.id}/start`}>
                  View details
                </Link>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
