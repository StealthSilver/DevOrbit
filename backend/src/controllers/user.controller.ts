import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient, ObjectId, ModifyResult } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const uri = process.env.MONGODB_URI as string;
let client: MongoClient | null = null;

async function connectClient(): Promise<MongoClient> {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client;
}

interface User {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  repositories: string[];
  followedUsers: string[];
  starRepos: string[];
}

export async function signup(req: Request, res: Response): Promise<void> {
  const { username, password, email } = req.body;
  try {
    const client = await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection<User>("users");

    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: "User already exists!" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: Omit<User, "_id"> = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };
    const result = await usersCollection.insertOne(newUser as User);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1h" }
    );
    res.json({ token, userId: result.insertedId });
  } catch (err: any) {
    console.error("Error during signup:", err.message);
    res.status(500).send("Server error");
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  try {
    const client = await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection<User>("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials!" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials!" });
      return;
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "1h" }
    );

    const { password: _, ...safeUser } = user;
    res.json({ token, userId: user._id, user: safeUser });
  } catch (err: any) {
    console.error("Error during login:", err.message);
    res.status(500).send("Server error!");
  }
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const client = await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection<User>("users");

    const users = await usersCollection
      .find({})
      .project({ password: 0 })
      .toArray();
    res.json(users);
  } catch (err: any) {
    console.error("Error fetching users:", err.message);
    res.status(500).send("Server error!");
  }
}

export async function getUserProfile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const client = await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection<User>("users");

    const user = await usersCollection.findOne(
      { _id: new ObjectId(req.params.id) },
      { projection: { password: 0 } }
    );
    if (!user) {
      res.status(404).json({ message: "User not found!" });
      return;
    }
    res.send(user);
  } catch (err: any) {
    console.error("Error fetching user:", err.message);
    res.status(500).send("Server error!");
  }
}

export async function updateUserProfile(
  req: Request,
  res: Response
): Promise<void> {
  const { email, password } = req.body;
  try {
    const client = await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection<User>("users");

    let updateFields: Partial<User> = {};
    if (email) {
      updateFields.email = email;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    const result: ModifyResult<User> = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    const updatedUser = result.value;
    if (!updatedUser) {
      res.status(404).json({ message: "User not found!" });
      return;
    }

    const { password: _, ...safeUser } = updatedUser;
    res.send(safeUser);
  } catch (err: any) {
    console.error("Error updating user:", err.message);
    res.status(500).send("Server error!");
  }
}

export async function deleteUserProfile(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const client = await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection<User>("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "User not found!" });
      return;
    }
    res.json({ message: "User Profile Deleted!" });
  } catch (err: any) {
    console.error("Error deleting user:", err.message);
    res.status(500).send("Server error!");
  }
}
