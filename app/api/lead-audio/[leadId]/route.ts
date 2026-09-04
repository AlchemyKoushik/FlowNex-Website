import { NextResponse } from "next/server";
import { readVoiceRecording } from "@/lib/flow/audio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ leadId: string }> },
) {
  const configuredSecret = process.env.FLOWNEX_INTERNAL_API_SECRET;
  if (!configuredSecret) {
    return NextResponse.json(
      { error: "configuration_required", message: "FLOWNEX_INTERNAL_API_SECRET is required before audio can be retrieved." },
      { status: 503 },
    );
  }

  const authHeader = request.headers.get("authorization") || "";
  if (authHeader !== `Bearer ${configuredSecret}`) {
    return NextResponse.json({ error: "unauthorized", message: "Audio access requires the internal API bearer token." }, { status: 401 });
  }

  const { leadId } = await params;
  if (!/^FN-\d{4}-\d{6}$/.test(leadId)) {
    return NextResponse.json({ error: "validation_error", message: "Invalid FlowNex Lead ID." }, { status: 400 });
  }

  const recording = await readVoiceRecording(leadId);
  if (!recording) {
    return NextResponse.json({ error: "not_found", message: "No voice recording exists for this lead." }, { status: 404 });
  }

  return new Response(new Uint8Array(recording.bytes), {
    status: 200,
    headers: {
      "content-type": recording.mimeType,
      "cache-control": "private, no-store",
    },
  });
}
