import { jsonError, jsonOk } from "@/lib/server/api-response";
import {
  getAttemptPayload,
  requireApiUser,
} from "@/lib/server/assessment-service";

type AttemptRouteProps = {
  params: Promise<{ attemptId: string }>;
};

export async function GET(_request: Request, { params }: AttemptRouteProps) {
  try {
    const user = await requireApiUser(["STUDENT"]);
    const { attemptId } = await params;
    return jsonOk(await getAttemptPayload(user, attemptId));
  } catch (error) {
    return jsonError(error);
  }
}
