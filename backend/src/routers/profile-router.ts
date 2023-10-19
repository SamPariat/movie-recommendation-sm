import { Request, Response, Router } from "express";

import authCheck from "../middleware/auth-check";

const router = Router();

router.get("/", authCheck, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).send("Unauthorized...");
    }
    
    res.status(200).send(`Logged in as ${req.user}`);
  } catch (e) {
    res.status(500).send();
  }
});

export default router;
