import AWS from "aws-sdk";

AWS.config.update({ region: "ap-south-1" });

const s3: AWS.S3 = new AWS.S3();
const S3_BUCKET: string = "insert_bucket_name";

export { s3, S3_BUCKET };
