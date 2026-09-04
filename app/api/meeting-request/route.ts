import { NextResponse } from "next/server";
import { MeetingRequestServiceError, processMeetingRequest } from "@/lib/flow/meeting-service";
import { validateMeetingFormData, ValidationError } from "@/lib/flow/validation";
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
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return errorResponse(400, {
        success: false,
        error: "validation_error",
        message: "Meeting requests must be submitted as multipart/form-data.",
      });
    }

    const formData = await request.formData();
    const validated = validateMeetingFormData(formData);
    const response = await processMeetingRequest(validated);

    return NextResponse.json(response, {
      status: response.processingStatus === "CONFIGURATION_REQUIRED" ? 202 : 200,
      headers: {
        "x-flownex-lead-id": response.leadId,
      },
    });
  } catch (error) {
    if (error instanceof MeetingRequestServiceError) {
      return errorResponse(error.status, error.body);
    }

    if (error instanceof ValidationError) {
      const status = error.code === "payload_too_large" ? 413 : error.code === "unsupported_media_type" ? 415 : 400;
      return errorResponse(status, {
        success: false,
        error: error.code,
        message: error.message,
        details: error.details,
      });
    }

    const message = error instanceof Error ? error.message : "Unknown backend failure.";
    console.error("[FlowNex meeting-request] internal_error", { message });
    return errorResponse(500, {
      success: false,
      error: "internal_error",
      message: "The meeting request could not be processed. Check server logs with the FlowNex Lead ID context where available.",
    });
  }
}
