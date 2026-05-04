import { jsonError, jsonOk } from "@/lib/server/api-response";
import {
  assignExamToStudents,
  requireApiUser,
} from "@/lib/server/assessment-service";

type AssignmentRouteProps = {
  params: Promise<{ examId: string }>;
};

export async function POST(request: Request, { params }: AssignmentRouteProps) {
  try {
    const user = await requireApiUser(["ADMIN", "EXAMINER"]);
    const { examId } = await params;
    const body = await request.json();
    await assignExamToStudents(user, examId, body.studentIds ?? []);
    return jsonOk({ id: examId });
  } catch (error) {
    return jsonError(error);
  }
}
