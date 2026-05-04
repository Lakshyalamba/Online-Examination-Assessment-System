import { jsonError, jsonOk } from "@/lib/server/api-response";
import {
  autoSubmitExpiredAttempt,
  requireApiUser,
  submitExamAttempt,
} from "@/lib/server/assessment-service";

type AttemptSubmitRouteProps = {
  params: Promise<{ attemptId: string }>;
};

export async function POST(request: Request, { params }: AttemptSubmitRouteProps) {
  try {
    const user = await requireApiUser(["STUDENT"]);
    const { attemptId } = await params;
    const body = await request.json().catch(() => ({}));

    if (body.autoSubmit) {
      await autoSubmitExpiredAttempt(user, attemptId);
    } else {
      await submitExamAttempt(user, attemptId);
    }

    return jsonOk({ attemptId });
  } catch (error) {
    return jsonError(error);
  }
}
