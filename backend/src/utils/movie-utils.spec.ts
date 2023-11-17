import { describe, expect, it } from "@jest/globals";
import dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";

import { ErrorMessages } from "../constants";
import {
  getMovieInformationById,
  getMovieCastById,
  getTop5Trending,
  getLatestTrendingMovie,
} from ".";
import { type MovieInfo } from "../types";
import { InvalidMovieIdError, MovieDoesNotExistError } from "../errors";

dotenv.config();
jest.mock("axios");

const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

describe("Testing the movie utility functions", () => {
  describe("getMovieInformationById function", () => {
    const validMovieId = 157736;
    const negativeMovieId = -1;
    const noMovieId = 123456789;

    it("Should return data for a valid movie id", async () => {
      const mockValue: MovieInfo = {
        adult: false,
        imagePath:
          "https://image.tmdb.org/t/p/w185/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        tagline: "Mankind was born on Earth. It was never meant to die here.",
        overview:
          "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
        title: "Interstellar",
      };

      mockedAxiosGet.mockResolvedValue({ data: mockValue } as AxiosResponse);

      expect(getMovieInformationById(validMovieId)).resolves.toStrictEqual(
        mockValue
      );
    });

    it("Should fail for a negative movie id", async () => {
      mockedAxiosGet.mockRejectedValue({
        response: {
          status: 404,
          data: {
            status_code: 6,
          },
        },
      });

      expect(getMovieInformationById(negativeMovieId)).rejects.toThrow(
        InvalidMovieIdError
      );
    });

    it("Should fail for a movie that does not exist", async () => {
      mockedAxiosGet.mockRejectedValue({
        response: {
          status: 404,
          data: {
            status_code: 34,
          },
        },
      });

      expect(getMovieInformationById(noMovieId)).rejects.toThrow(
        MovieDoesNotExistError
      );
    });
  });

  // describe("getMovieCastById function", () => {});

  // describe("getTop5Trending function", () => {});

  // describe("getLatestTrendingMovie function", () => {});
});
