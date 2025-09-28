import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  repositories: Types.ObjectId[];
  followedUsers: Types.ObjectId[];
  starRepos: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    repositories: [
      { type: Schema.Types.ObjectId, ref: "Repository", default: [] },
    ],
    followedUsers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    starRepos: [
      { type: Schema.Types.ObjectId, ref: "Repository", default: [] },
    ],
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
