import { Router, Request, Response } from "express";
import userRouter from "./user.router";
import repoRouter from "./repo.router";
import issueRouter from "./issue.router";

const mainRouter: Router = Router();

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);

mainRouter.get("/", (req: Request, res: Response) => {
  res.send("Welcome!");
});

export default mainRouter;
