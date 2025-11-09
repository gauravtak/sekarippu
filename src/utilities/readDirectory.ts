import { readDir } from "@tauri-apps/plugin-fs";

export async function readDirectory(localPath: string) {
  const content = await readDir(localPath);
  return content;
}
