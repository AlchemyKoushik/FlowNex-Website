export const TEAM_TIMEZONE = "Asia/Kolkata";
export const DEFAULT_SLOT_MINUTES = 60;

export interface SlotInstant {
  startUtc: string;
  endUtc: string;
  startIST: string;
  endIST: string;
}

function isValidTimezone(value: string): boolean {
  if (!value || value.length > 80) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

function partsFor(date: Date, timeZone: string): Record<string, number> {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value === "24" ? "0" : part.value)]),
  ) as Record<string, number>;
}

function offsetMsAt(utcDate: Date, timeZone: string): number {
  const parts = partsFor(utcDate, timeZone);
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  return asUtc - utcDate.getTime();
}

export function zonedWallTimeToUtc(date: string, time: string, timeZone: string): Date | null {
  if (!isValidTimezone(timeZone)) return null;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const guessedUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  const firstPass = new Date(guessedUtc.getTime() - offsetMsAt(guessedUtc, timeZone));
  const secondPass = new Date(guessedUtc.getTime() - offsetMsAt(firstPass, timeZone));
  const rendered = partsFor(secondPass, timeZone);

  if (
    rendered.year !== year ||
    rendered.month !== month ||
    rendered.day !== day ||
    rendered.hour !== hour ||
    rendered.minute !== minute
  ) {
    return null;
  }

  return secondPass;
}

export function formatInTimezone(utcDate: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .format(utcDate)
    .replace(", ", "T");
}

export function buildSlotInstant(date: string, time: string, timeZone: string, slotMinutes = DEFAULT_SLOT_MINUTES): SlotInstant | null {
  const start = zonedWallTimeToUtc(date, time, timeZone);
  if (!start) return null;
  const end = new Date(start.getTime() + slotMinutes * 60_000);
  return {
    startUtc: start.toISOString(),
    endUtc: end.toISOString(),
    startIST: formatInTimezone(start, TEAM_TIMEZONE),
    endIST: formatInTimezone(end, TEAM_TIMEZONE),
  };
}

export function isFutureSlot(date: string, time: string, timeZone: string): boolean {
  const start = zonedWallTimeToUtc(date, time, timeZone);
  return Boolean(start && start.getTime() > Date.now());
}

export function assertTimezone(value: string): boolean {
  return isValidTimezone(value);
}
