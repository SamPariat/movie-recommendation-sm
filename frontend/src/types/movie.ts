interface CommonDetails {
  imagePath: string;
}

interface MovieCommonDetails extends CommonDetails {
  adult: boolean;
  tagline: string;
}

export interface MovieInfo extends MovieCommonDetails {
  overview: string;
}

interface PersonInfo extends CommonDetails {
  name: string;
  character: string;
}

export interface CastInfo {
  actors: PersonInfo[];
  director: Omit<PersonInfo, "character">[];
}

export interface TrendingInfo extends Omit<MovieCommonDetails, "tagline"> {
  id: number;
  title: string;
}