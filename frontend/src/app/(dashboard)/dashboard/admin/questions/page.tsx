import { QuestionBankManager } from "@/components/authoring/question-bank-manager";
import {
  listQuestionsForUser,
  requireApiUser,
} from "@/lib/server/assessment-service";

export default async function AdminQuestionsPage() {
  const user = await requireApiUser(["ADMIN"]);
  const questions = await listQuestionsForUser(user);

  return <QuestionBankManager initialQuestions={questions} />;
}
