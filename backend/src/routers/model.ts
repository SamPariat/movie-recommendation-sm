import axios, { AxiosError } from "axios";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/run-model", async (req: Request, res: Response) => {
  try {
    const movie = req.query.movie;
    const predictedResults = await axios.get(
      `http://127.0.0.1:3524/movie-prediction?movie=${movie}`
    );

    res.status(200).send(predictedResults.data);
  } catch (e) {
    if (e instanceof AxiosError) {
      res.status(400).send(e.message);
    }
    res.status(500).send();
  }
});

export default router;
