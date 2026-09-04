import fs from "fs/promises";
import path from "path";

const AUDIO_DIR = path.join(process.cwd(), ".data", "flownex", "voice-recordings");

const EXTENSIONS_BY_MIME: Record<string, string> = {
  "audio/webm": "webm",
  "audio/webm;codecs=opus": "webm",
  "audio/ogg": "ogg",
  "audio/ogg;codecs=opus": "ogg",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
};

function extensionFor(mimeType: string): string {
  return EXTENSIONS_BY_MIME[mimeType.toLowerCase().replace(/\s+/g, "")] || "bin";
}

export async function saveVoiceRecording(leadId: string, recording: File): Promise<{
  url: string;
  bytes: number;
  mimeType: string;
}> {
  await fs.mkdir(AUDIO_DIR, { recursive: true });
  const extension = extensionFor(recording.type || "");
  const fileName = `${leadId}.${extension}`;
  const filePath = path.join(AUDIO_DIR, fileName);
  const buffer = Buffer.from(await recording.arrayBuffer());
  await fs.writeFile(filePath, buffer);

  return {
    url: `/api/lead-audio/${encodeURIComponent(leadId)}`,
    bytes: buffer.length,
    mimeType: recording.type,
  };
}

export async function readVoiceRecording(leadId: string): Promise<{
  bytes: Buffer;
  mimeType: string;
} | null> {
  const files = await fs.readdir(AUDIO_DIR).catch(() => []);
  const match = files.find((name) => name.startsWith(`${leadId}.`));
  if (!match) return null;
  const bytes = await fs.readFile(path.join(AUDIO_DIR, match));
  const extension = match.split(".").pop();
  const mimeType =
    extension === "webm" ? "audio/webm" :
    extension === "ogg" ? "audio/ogg" :
    extension === "mp3" ? "audio/mpeg" :
    extension === "m4a" ? "audio/mp4" :
    extension === "wav" ? "audio/wav" :
    "application/octet-stream";
  return { bytes, mimeType };
}
