import { Request, Response, Router } from "express";

import { UnauthorizedError } from "../errors";
import authCheck from "../middleware/auth-check";

const router = Router();

/**
 * @path GET /profile
 * @summary User profile
 * @description Allows fetching profile information after authentication
 * @throws {UnauthorizedError} If the user is not authenticated
 */
router.get("/", authCheck, async (req: Request, res: Response) => {
  res.json(req.user);
});

export default router;
