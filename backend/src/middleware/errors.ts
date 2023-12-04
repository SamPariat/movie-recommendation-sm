import chalk from "chalk";
import { NextFunction, Request, Response } from "express";

import { HttpStatus } from "../constants";
import * as errors from "../errors";

/**
 *
 * The global error middleware handler
 * @param error The error that occurs throughout the application
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns The response status code based on the error instance
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(chalk.bgYellow(error.name));

  switch (true) {
    // "400"
    case error instanceof errors.InvalidMovieIdError:
    case error instanceof errors.NoReviewProvidedError:
    case error instanceof errors.QueryInvalidError:
      return res.status(HttpStatus.BadRequest).json({ error: error.message });

    // "401"
    case error instanceof errors.UnauthorizedError:
      return res.status(HttpStatus.Unauthorized).json({ error: error.message });

    // "404"
    case error instanceof errors.MovieDoesNotExistError:
    case error instanceof errors.NoMoviesError:
    case error instanceof errors.NoSentimentError:
      return res.status(HttpStatus.NotFound).json({ error: error.message });

    // "500"
    case error instanceof errors.ErrorFetchingReviews:
    case error instanceof errors.InternalServerError:
      return res.status(HttpStatus.InternalServerError).json();

    // "503"
    case error instanceof errors.ErrorFetchingCast:
    case error instanceof errors.ErrorFetchingMovieInformation:
    case error instanceof errors.ErrorFetchingReviewSentiment:
    case error instanceof errors.ErrorFetchingTrendingInfo:
    case error instanceof errors.ModelServerError:
      return res.status(HttpStatus.ServiceUnavailable).json();

    // Default
    default:
      res.status(HttpStatus.InternalServerError).json();
      break;
  }
};
