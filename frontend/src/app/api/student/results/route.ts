import { jsonError, jsonOk } from "@/lib/server/api-response";
import {
  listStudentResults,
  requireApiUser,
} from "@/lib/server/assessment-service";

export async function GET() {
  try {
    const user = await requireApiUser(["STUDENT"]);
    return jsonOk(await listStudentResults(user));
  } catch (error) {
    return jsonError(error);
  }
}
