import { jsonError, jsonOk } from "@/lib/server/api-response";
import {
  deleteExam,
  requireApiUser,
  updateExam,
  updateExamStatus,
} from "@/lib/server/assessment-service";

type ExamRouteProps = {
  params: Promise<{ examId: string }>;
};

export async function PUT(request: Request, { params }: ExamRouteProps) {
  try {
    const user = await requireApiUser(["ADMIN", "EXAMINER"]);
    const { examId } = await params;
    await updateExam(user, examId, await request.json());
    return jsonOk({ id: examId });
  } catch (error) {
    return jsonError(error);
  }
}

export async function DELETE(_request: Request, { params }: ExamRouteProps) {
  try {
    const user = await requireApiUser(["ADMIN", "EXAMINER"]);
    const { examId } = await params;
    await deleteExam(user, examId);
    return jsonOk({ id: examId });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request, { params }: ExamRouteProps) {
  try {
    const user = await requireApiUser(["ADMIN", "EXAMINER"]);
    const { examId } = await params;
    const body = await request.json();
    await updateExamStatus(user, examId, body.status);
    return jsonOk({ id: examId });
  } catch (error) {
    return jsonError(error);
  }
}
