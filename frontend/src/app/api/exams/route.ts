import { jsonError, jsonOk } from "@/lib/server/api-response";
import {
  createExam,
  listExamsForUser,
  requireApiUser,
} from "@/lib/server/assessment-service";

export async function GET() {
  try {
    const user = await requireApiUser(["ADMIN", "EXAMINER"]);
    return jsonOk(await listExamsForUser(user));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireApiUser(["ADMIN", "EXAMINER"]);
    const id = await createExam(user, await request.json());
    return jsonOk({ id }, 201);
  } catch (error) {
    return jsonError(error);
  }
}
