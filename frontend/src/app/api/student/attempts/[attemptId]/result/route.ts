import { jsonError, jsonOk } from "@/lib/server/api-response";
import {
  getStudentResult,
  requireApiUser,
} from "@/lib/server/assessment-service";

type AttemptResultRouteProps = {
  params: Promise<{ attemptId: string }>;
};

export async function GET(_request: Request, { params }: AttemptResultRouteProps) {
  try {
    const user = await requireApiUser(["ADMIN", "EXAMINER", "STUDENT"]);
    const { attemptId } = await params;
    return jsonOk(await getStudentResult(user, attemptId));
  } catch (error) {
    return jsonError(error);
  }
}
