import { jsonError, jsonOk } from "@/lib/server/api-response";
import {
  deleteQuestion,
  requireApiUser,
  updateQuestion,
} from "@/lib/server/assessment-service";

type QuestionRouteProps = {
  params: Promise<{ questionId: string }>;
};

export async function PUT(request: Request, { params }: QuestionRouteProps) {
  try {
    const user = await requireApiUser(["ADMIN", "EXAMINER"]);
    const { questionId } = await params;
    await updateQuestion(user, questionId, await request.json());
    return jsonOk({ id: questionId });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: QuestionRouteProps) {
  try {
    const user = await requireApiUser(["ADMIN", "EXAMINER"]);
    const { questionId } = await params;
    await deleteQuestion(user, questionId);
    return jsonOk({ id: questionId });
  } catch (error) {
    return jsonError(error);
  }
}
