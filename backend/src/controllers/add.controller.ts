import { promises as fs } from "fs";
import path from "path";

export async function addRepo(filePath: string): Promise<void> {
  const repoPath = path.resolve(process.cwd(), ".devOrbit");
  const stagingPath = path.join(repoPath, "staging");

  try {
    await fs.mkdir(stagingPath, { recursive: true });
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(stagingPath, fileName));
    console.log(`File ${fileName} added to the staging area!`);
  } catch (err) {
    console.error("Error adding file:", err);
  }
}
