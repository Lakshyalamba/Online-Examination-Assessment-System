import { jsonError, jsonOk } from "@/lib/server/api-response";
import {
  listAssignedExamsForStudent,
  requireApiUser,
} from "@/lib/server/assessment-service";

export async function GET() {
  try {
    const user = await requireApiUser(["STUDENT"]);
    return jsonOk(await listAssignedExamsForStudent(user));
  } catch (error) {
    return jsonError(error);
  }
}
