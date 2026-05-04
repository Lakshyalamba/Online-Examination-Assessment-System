import { jsonError, jsonOk } from "@/lib/server/api-response";
import {
  getExamForAttempt,
  requireApiUser,
} from "@/lib/server/assessment-service";

type StudentExamRouteProps = {
  params: Promise<{ examId: string }>;
};

export async function GET(_request: Request, { params }: StudentExamRouteProps) {
  try {
    const user = await requireApiUser(["STUDENT"]);
    const { examId } = await params;
    return jsonOk(await getExamForAttempt(user, examId));
  } catch (error) {
    return jsonError(error);
  }
}
