import { jsonError, jsonOk } from "@/lib/server/api-response";
import {
  requireApiUser,
  startExamAttempt,
} from "@/lib/server/assessment-service";

type StudentExamStartRouteProps = {
  params: Promise<{ examId: string }>;
};

export async function POST(
  _request: Request,
  { params }: StudentExamStartRouteProps,
) {
  try {
    const user = await requireApiUser(["STUDENT"]);
    const { examId } = await params;
    const attemptId = await startExamAttempt(user, examId);
    return jsonOk({ attemptId }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
