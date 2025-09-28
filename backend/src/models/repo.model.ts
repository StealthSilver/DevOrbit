import { Schema, model, Document, Types } from "mongoose";

export interface IRepository extends Document {
  name: string;
  description?: string;
  content: string[];
  visibility: boolean;
  owner: Types.ObjectId;
  issues: Types.ObjectId[];
}

const RepositorySchema = new Schema<IRepository>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    content: [{ type: String }],
    visibility: { type: Boolean, default: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    issues: [{ type: Schema.Types.ObjectId, ref: "Issue" }],
  },
  { timestamps: true }
);

export const Repository = model<IRepository>("Repository", RepositorySchema);
