import { Request, Response } from "express";
import mongoose from "mongoose";
import { Repository } from "../models/repo.model";

export async function createRepository(
  req: Request,
  res: Response
): Promise<void> {
  const { owner, name, issues, content, description, visibility } = req.body;
  try {
    if (!name) {
      res.status(400).json({ error: "Repository name is required!" });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      res.status(400).json({ error: "Invalid User ID!" });
      return;
    }

    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner,
      content,
      issues,
    });
    const result = await newRepository.save();

    res
      .status(201)
      .json({ message: "Repository created!", repositoryID: result._id });
  } catch (err: any) {
    console.error("Error creating repository:", err.message);
    res.status(500).send("Server error");
  }
}

export async function getAllRepositories(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");
    res.json(repositories);
  } catch (err: any) {
    console.error("Error fetching repositories:", err.message);
    res.status(500).send("Server error");
  }
}

export async function fetchRepositoryById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const repository = await Repository.findById(req.params.id)
      .populate("owner")
      .populate("issues");
    res.json(repository);
  } catch (err: any) {
    console.error("Error fetching repository:", err.message);
    res.status(500).send("Server error");
  }
}

export async function fetchRepositoryByName(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const repository = await Repository.find({ name: req.params.name })
      .populate("owner")
      .populate("issues");
    res.json(repository);
  } catch (err: any) {
    console.error("Error fetching repository:", err.message);
    res.status(500).send("Server error");
  }
}

export async function fetchRepositoriesForCurrentUser(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const repositories = await Repository.find({ owner: req.params.userID });
    if (!repositories || repositories.length === 0) {
      res.status(404).json({ error: "User Repositories not found!" });
      return;
    }
    res.json({ message: "Repositories found!", repositories });
  } catch (err: any) {
    console.error("Error fetching user repositories:", err.message);
    res.status(500).send("Server error");
  }
}

export async function updateRepositoryById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const repository = await Repository.findById(req.params.id);
    if (!repository) {
      res.status(404).json({ error: "Repository not found!" });
      return;
    }
    repository.content.push(req.body.content);
    repository.description = req.body.description;
    const updatedRepository = await repository.save();
    res.json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err: any) {
    console.error("Error updating repository:", err.message);
    res.status(500).send("Server error");
  }
}

export async function toggleVisibilityById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const repository = await Repository.findById(req.params.id);
    if (!repository) {
      res.status(404).json({ error: "Repository not found!" });
      return;
    }
    repository.visibility = !repository.visibility;
    const updatedRepository = await repository.save();
    res.json({
      message: "Repository visibility toggled successfully!",
      repository: updatedRepository,
    });
  } catch (err: any) {
    console.error("Error toggling visibility:", err.message);
    res.status(500).send("Server error");
  }
}

export async function deleteRepositoryById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const repository = await Repository.findByIdAndDelete(req.params.id);
    if (!repository) {
      res.status(404).json({ error: "Repository not found!" });
      return;
    }
    res.json({ message: "Repository deleted successfully!" });
  } catch (err: any) {
    console.error("Error deleting repository:", err.message);
    res.status(500).send("Server error");
  }
}
