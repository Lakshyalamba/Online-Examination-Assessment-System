import { ExamManager } from "@/components/authoring/exam-manager";
import {
  listExamsForUser,
  listQuestionsForUser,
  listStudentsForAssignment,
  requireApiUser,
} from "@/lib/server/assessment-service";

export default async function AdminExamsPage() {
  const user = await requireApiUser(["ADMIN"]);
  const [exams, questions, students] = await Promise.all([
    listExamsForUser(user),
    listQuestionsForUser(user),
    listStudentsForAssignment(),
  ]);

  return (
    <ExamManager
      initialExams={exams}
      questions={questions}
      students={students}
    />
  );
}
