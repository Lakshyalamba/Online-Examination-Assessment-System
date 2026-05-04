import Link from "next/link";

import { StartExamButton } from "@/components/student/start-exam-button";
import {
  getExamForAttempt,
  requireApiUser,
} from "@/lib/server/assessment-service";

type StudentExamStartPageProps = {
  params: Promise<{
    examId: string;
  }>;
};

export default async function StudentExamStartPage({
  params,
}: StudentExamStartPageProps) {
  const { examId } = await params;
  const user = await requireApiUser(["STUDENT"]);
  const exam = await getExamForAttempt(user, examId);
  const alreadyAttempted = exam.attemptStatus && exam.attemptStatus !== "in_progress";
  const unavailableMessage = alreadyAttempted
    ? "You have already submitted this exam."
    : exam.availabilityStatus === "upcoming"
      ? "This exam has not opened yet."
      : exam.availabilityStatus === "expired"
        ? "This exam window has expired."
        : null;
  const statusLabel = alreadyAttempted
    ? "attempted"
    : unavailableMessage
      ? unavailableMessage
      : "available";

  return (
    <div className="student-record-workspace">
      <section className="surface-card student-record-hero">
        <p className="surface-card__eyebrow">Exam details</p>
        <h2>{exam.title}</h2>
        <p>{exam.code}</p>
      </section>

      <section className="surface-card student-detail-card">
        <span className={`student-status-chip student-status-chip--${exam.availabilityStatus}`}>
          {statusLabel}
        </span>
        <div className="student-metric-grid">
          <div><span>Duration</span><strong>{exam.durationMinutes} min</strong></div>
          <div><span>Total marks</span><strong>{exam.totalMarks}</strong></div>
          <div><span>Questions</span><strong>{exam.questionCount}</strong></div>
          <div><span>Attempt status</span><strong>{exam.attemptStatus ?? "Not started"}</strong></div>
        </div>
        <div className="student-detail-window">
          <span>Availability window</span>
          <strong>
            {new Date(exam.windowStartsAt).toLocaleString()} to{" "}
            {new Date(exam.windowEndsAt).toLocaleString()}
          </strong>
        </div>
        {exam.attemptStatus === "in_progress" && exam.attemptId ? (
          <Link className="button-link" href={`/student/attempts/${exam.attemptId}`}>
            Continue attempt
          </Link>
        ) : (
          <StartExamButton
            disabled={Boolean(unavailableMessage)}
            examId={exam.id}
            label="Start attempt"
          />
        )}
      </section>
    </div>
  );
}
