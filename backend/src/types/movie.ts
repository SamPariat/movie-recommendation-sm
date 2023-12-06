interface CommonDetails {
  imagePath: string;
}

interface MovieCommonDetails extends CommonDetails {
  adult: boolean;
  tagline: string;
  genres: string[];
  releaseDate: string;
}

export interface MovieInfo extends MovieCommonDetails {
  overview: string;
  title: string;
}

interface PersonInfo extends CommonDetails {
  name: string;
  character: string;
}

export interface CastInfo {
  actors: PersonInfo[];
  director: Omit<PersonInfo, "character">[];
}

export interface TrendingInfo extends MovieCommonDetails {
  id: number;
  title: string;
}

export interface MovieData extends MovieInfo {
  title: string;
}
