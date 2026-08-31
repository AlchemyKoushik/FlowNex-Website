import { rmSync } from "node:fs";

for (const dir of [".next", ".next-local"]) {
  rmSync(dir, { recursive: true, force: true });
}
