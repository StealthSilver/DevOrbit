import dotenv from "dotenv";
import AWS from "aws-sdk";

dotenv.config();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const S3_BUCKET = "sampledevorbitbucket";

export { s3, S3_BUCKET };
