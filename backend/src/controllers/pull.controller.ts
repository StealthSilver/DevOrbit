import { promises as fs } from "fs";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws-config";

export async function pullRepo(): Promise<void> {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const data = await s3
      .listObjectsV2({ Bucket: S3_BUCKET, Prefix: "commits/" })
      .promise();

    const objects = data.Contents ?? [];

    for (const object of objects) {
      if (!object.Key) continue;
      const commitDir = path.join(
        commitsPath,
        path.dirname(object.Key).split("/").pop() || ""
      );
      await fs.mkdir(commitDir, { recursive: true });

      const params = { Bucket: S3_BUCKET, Key: object.Key };
      const fileContent = await s3.getObject(params).promise();
      if (fileContent.Body) {
        await fs.writeFile(
          path.join(repoPath, object.Key),
          fileContent.Body as Buffer
        );
      }
    }

    console.log("All commits pulled from S3.");
  } catch (err) {
    console.error("Unable to pull:", err);
  }
}
