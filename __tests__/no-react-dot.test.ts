import fs from "node:fs/promises";
import path from "node:path";

async function walk(dir: string, out: string[] = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    // Skip noisy/irrelevant dirs
    if (e.isDirectory() && (e.name === "node_modules" || e.name === ".next"))
      continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

describe("code style", () => {
  test("does not use React.* (prefer named imports like useState/useEffect)", async () => {
    const root = process.cwd();
    const appDir = path.join(root, "app");
    const files = (await walk(appDir)).filter(
      (f) => f.endsWith(".ts") || f.endsWith(".tsx")
    );

    const offenders: Array<{ file: string; line: number; snippet: string }> =
      [];
    for (const file of files) {
      const content = await fs.readFile(file, "utf8");
      const lines = content.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const idx = lines[i].indexOf("React.");
        if (idx !== -1) {
          offenders.push({
            file: path.relative(root, file),
            line: i + 1,
            snippet: lines[i].trim(),
          });
          break;
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
