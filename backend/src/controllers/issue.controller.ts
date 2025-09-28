import { Request, Response } from "express";
import { Issue } from "../models/issue.model";

export async function createIssue(req: Request, res: Response): Promise<void> {
  const { title, description } = req.body;
  const { id } = req.params;

  try {
    const issue = new Issue({ title, description, repository: id });
    await issue.save();
    res.status(201).json(issue);
  } catch (err: any) {
    console.error("Error during issue creation:", err.message);
    res.status(500).send("Server error");
  }
}

export async function updateIssueById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      res.status(404).json({ error: "Issue not found!" });
      return;
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();
    res.json(issue);
  } catch (err: any) {
    console.error("Error during issue update:", err.message);
    res.status(500).send("Server error");
  }
}

export async function deleteIssueById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  try {
    const issue = await Issue.findByIdAndDelete(id);
    if (!issue) {
      res.status(404).json({ error: "Issue not found!" });
      return;
    }
    res.json({ message: "Issue deleted" });
  } catch (err: any) {
    console.error("Error during issue deletion:", err.message);
    res.status(500).send("Server error");
  }
}

export async function getAllIssues(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const issues = await Issue.find({ repository: id });
    if (!issues || issues.length === 0) {
      res.status(404).json({ error: "Issues not found!" });
      return;
    }
    res.status(200).json(issues);
  } catch (err: any) {
    console.error("Error fetching issues:", err.message);
    res.status(500).send("Server error");
  }
}

export async function getIssueById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);
    if (!issue) {
      res.status(404).json({ error: "Issue not found!" });
      return;
    }
    res.json(issue);
  } catch (err: any) {
    console.error("Error fetching issue:", err.message);
    res.status(500).send("Server error");
  }
}
