import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { MovieService } from './movie.service';

@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get('info')
  getMovieInformationById(
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.movieService.getMovieInformationById(id);
  }

  @Get('cast')
  getMovieCastById(@Query('id', ParseIntPipe) id: number) {
    return this.movieService.getMovieCastById(id);
  }

  @Get('top-5-trending')
  getTopFiveTrending() {
    return this.movieService.getTopFiveTrending();
  }

  @Get('latest-trending')
  getLatestTrending() {
    return this.movieService.getLatestTrending();
  }

  @Get('all')
  getAllMovies() {
    return this.movieService.getAllMovies();
  }
}
