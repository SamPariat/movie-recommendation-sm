import { describe, expect, it } from "@jest/globals";
import dotenv from "dotenv";

dotenv.config();

import { INVALID_MOVIE_ID, MOVIE_DOES_NOT_EXIST } from "../constants";
import { getMovieInformationById } from "../utils/movie-utils";

describe("Testing success & failure of the getMovieInformationById(movieId: number) custom function", () => {
  it("Tests movie information of Interstellar", async () => {
    const movieInfo = await getMovieInformationById(157336);
    expect(movieInfo).toStrictEqual({
      adult: false,
      imagePath:
        "https://image.tmdb.org/t/p/w185/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
      tagline: "Mankind was born on Earth. It was never meant to die here.",
      overview:
        "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    });
  });

  it("Tests if invalid movie id", async () => {
    await expect(getMovieInformationById(-1)).rejects.toThrow(INVALID_MOVIE_ID);
  });

  it("Tests if movie id does not exist", async () => {
    await expect(getMovieInformationById(1111111111)).rejects.toThrow(
      MOVIE_DOES_NOT_EXIST
    );
  });
});

describe("Testing success & failure of the getMovieCastById(movieId: number) custom function", () => {});
