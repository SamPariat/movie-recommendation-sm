import { Request, Response, Router } from "express";

import authCheck from "../middleware/auth-check";

const router = Router();

router.get("/", authCheck, async (req: Request, res: Response) => {
  res.send(req.user);
});

export default router;
