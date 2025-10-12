import Link from "next/link";
import path from "node:path";
import { promises as fs } from "node:fs";
import MoveForm from "../../components/MoveForm"; // <-- relative import, works without tsconfig aliases

export const dynamic = "force-dynamic";

type Row = { name: string; size: number; when: string };

async function listInbox(): Promise<Row[]> {
  const dir = path.join(process.cwd(), "storage", "inbox");
  try {
    const ents = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      ents
        .filter((e) => e.isFile())
        .map(async (e) => {
          const full = path.join(dir, e.name);
          const st = await fs.stat(full);
          return {
            name: e.name,
            size: st.size,
            when: st.mtime.toISOString().slice(0, 19).replace("T", " "),
          };
        })
    );
    return files.sort((a, b) => (a.name > b.name ? 1 : -1));
  } catch {
    return [];
  }
}

export default async function Page() {
  const files = await listInbox();

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-3">Inbox</h1>
      <p className="mb-4">Upload and move files from here.</p>

      <form
        action="/api/inbox/upload"
        method="post"
        encType="multipart/form-data"
        className="flex gap-2 items-center"
      >
        <input type="file" name="file" required />
        <button type="submit" className="border rounded px-3 py-1">Upload</button>
        <Link href="/history" className="border rounded px-3 py-1">History</Link>
      </form>

      <div className="mt-6">
        {files.length === 0 ? (
          <p className="text-sm opacity-70">No files in inbox yet.</p>
        ) : (
          <table className="text-sm">
            <thead>
              <tr>
                <th className="text-left pr-6">File</th>
                <th className="text-left pr-6">Size</th>
                <th className="text-left pr-6">When</th>
                <th className="text-left">Move</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr key={f.name} className="align-top">
                  <td className="pr-6">{f.name}</td>
                  <td className="pr-6">{f.size.toLocaleString()} B</td>
                  <td className="pr-6">{f.when}</td>
                  <td>
                    <MoveForm name={f.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}
