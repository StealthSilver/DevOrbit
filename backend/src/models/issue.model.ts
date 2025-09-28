import { Schema, model, Document, Types } from "mongoose";

export interface IIssue extends Document {
  title: string;
  description: string;
  status: "open" | "closed";
  repository: Types.ObjectId;
}

const IssueSchema = new Schema<IIssue>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    repository: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
  },
  { timestamps: true }
);

export const Issue = model<IIssue>("Issue", IssueSchema);
