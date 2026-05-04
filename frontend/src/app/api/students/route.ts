import { jsonError, jsonOk } from "@/lib/server/api-response";
import {
  listStudentsForAssignment,
  requireApiUser,
} from "@/lib/server/assessment-service";

export async function GET() {
  try {
    await requireApiUser(["ADMIN", "EXAMINER"]);
    return jsonOk(await listStudentsForAssignment());
  } catch (error) {
    return jsonError(error);
  }
}
