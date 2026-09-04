import fs from "fs/promises";
import path from "path";
import { FlowNexLead, LeadTraceEvent } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data", "flownex");
const LEADS_DIR = path.join(DATA_DIR, "leads");
const INDEX_FILE = path.join(DATA_DIR, "index.json");

interface LeadIndex {
  lastSequence: number;
  byIdempotencyKey: Record<string, string>;
}

async function ensureStorage(): Promise<void> {
  await fs.mkdir(LEADS_DIR, { recursive: true });
}

async function readIndex(): Promise<LeadIndex> {
  await ensureStorage();
  try {
    const raw = await fs.readFile(INDEX_FILE, "utf8");
    return JSON.parse(raw) as LeadIndex;
  } catch {
    return { lastSequence: 0, byIdempotencyKey: {} };
  }
}

async function writeIndex(index: LeadIndex): Promise<void> {
  await ensureStorage();
  await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2), "utf8");
}

function leadPath(leadId: string): string {
  return path.join(LEADS_DIR, `${leadId}.json`);
}

export async function getLeadById(leadId: string): Promise<FlowNexLead | null> {
  try {
    const raw = await fs.readFile(leadPath(leadId), "utf8");
    return JSON.parse(raw) as FlowNexLead;
  } catch {
    return null;
  }
}

export async function getLeadByIdempotencyKey(idempotencyKey: string): Promise<FlowNexLead | null> {
  const index = await readIndex();
  const leadId = index.byIdempotencyKey[idempotencyKey];
  return leadId ? getLeadById(leadId) : null;
}

export async function reserveLeadId(idempotencyKey: string, year = new Date().getFullYear()): Promise<string> {
  const index = await readIndex();
  const existing = index.byIdempotencyKey[idempotencyKey];
  if (existing) return existing;

  index.lastSequence += 1;
  const leadId = `FN-${year}-${String(index.lastSequence).padStart(6, "0")}`;
  index.byIdempotencyKey[idempotencyKey] = leadId;
  await writeIndex(index);
  return leadId;
}

export async function saveLead(lead: FlowNexLead): Promise<void> {
  await ensureStorage();
  await fs.writeFile(leadPath(lead.leadId), JSON.stringify(lead, null, 2), "utf8");
}

export function trace(event: string, detail?: string): LeadTraceEvent {
  return {
    event,
    at: new Date().toISOString(),
    ...(detail ? { detail } : {}),
  };
}
