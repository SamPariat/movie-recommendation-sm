import { AxiosError } from "axios";
import { Request, Response, Router } from "express";

import { INTERNAL_SERVER_ERROR } from "../constants";

const router = Router();

router.get("/sentiment", async (req: Request, res: Response) => {
  try {
    const comment = req.query.comment;
  } catch (e) {
    if (e instanceof AxiosError) {
      return res.status(400).send({ error: e.message });
    }
    res.status(500).send({ error: INTERNAL_SERVER_ERROR });
  }
});

export default router;
