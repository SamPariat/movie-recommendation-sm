import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { MovieService } from './movie.service';
import {
  AllMovies,
  CastInfo,
  MovieInfo,
  TrendingInfo,
} from './types';

@Controller('movie')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get('info')
  @HttpCode(HttpStatus.OK)
  getMovieInformationById(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<MovieInfo> {
    return this.movieService.getMovieInformationById(id);
  }

  @Get('cast')
  @HttpCode(HttpStatus.OK)
  getMovieCastById(
    @Query('id', ParseIntPipe) id: number,
  ): Promise<CastInfo> {
    return this.movieService.getMovieCastById(id);
  }

  @Get('top-5-trending')
  @HttpCode(HttpStatus.OK)
  getTopFiveTrending(): Promise<{
    top5Trending: TrendingInfo[];
  }> {
    return this.movieService.getTopFiveTrending();
  }

  @Get('latest-trending')
  @HttpCode(HttpStatus.OK)
  getLatestTrending(): Promise<{
    latestTrending: TrendingInfo;
  }> {
    return this.movieService.getLatestTrending();
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  getAllMovies(): Promise<AllMovies> {
    return this.movieService.getAllMovies();
  }
}
