import { jsonError, jsonOk } from "@/lib/server/api-response";
import {
  requireApiUser,
  saveAttemptAnswer,
} from "@/lib/server/assessment-service";

type AttemptAnswerRouteProps = {
  params: Promise<{ attemptId: string }>;
};

export async function POST(request: Request, { params }: AttemptAnswerRouteProps) {
  try {
    const user = await requireApiUser(["STUDENT"]);
    const { attemptId } = await params;
    const body = await request.json();
    await saveAttemptAnswer(user, attemptId, body.examQuestionId, {
      selectedOptionIds: body.selectedOptionIds,
      answerText: body.answerText,
    });
    return jsonOk({ attemptId });
  } catch (error) {
    return jsonError(error);
  }
}
