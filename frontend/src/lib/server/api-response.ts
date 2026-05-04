import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { AssessmentError } from "@/lib/server/assessment-service";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function jsonError(error: unknown) {
  if (error instanceof AssessmentError) {
    return NextResponse.json(
      { error: { message: error.message } },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: {
          message: "Validation failed.",
          issues: error.issues,
        },
      },
      { status: 422 },
    );
  }

  console.error("Unhandled API error.", error);

  return NextResponse.json(
    { error: { message: "Something went wrong. Please try again." } },
    { status: 500 },
  );
}
