import { NextResponse } from "next/server";
import { requestAvailabilityFromN8n } from "@/lib/flow/n8n";
import { validateAvailabilityRequest, ValidationError } from "@/lib/flow/validation";
import type { MeetingRequestErrorResponse } from "@/lib/flow/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function errorResponse(
  status: number,
  body: MeetingRequestErrorResponse,
): NextResponse<MeetingRequestErrorResponse> {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  try {
    const validated = await validateAvailabilityRequest(request);
    const response = await requestAvailabilityFromN8n(validated);

    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    if (error instanceof ValidationError) {
      return errorResponse(422, {
        success: false,
        error: error.code,
        message: error.message,
        details: error.details,
      });
    }

    const message = error instanceof Error ? error.message : "Unknown backend failure.";
    console.error("[FlowNex availability] internal_error", { message });
    return errorResponse(500, {
      success: false,
      error: "internal_error",
      message: "Availability could not be checked right now.",
    });
  }
}
