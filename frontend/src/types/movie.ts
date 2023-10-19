interface CommonDetails {
  imagePath: string;
}

interface MovieInfo extends CommonDetails {
  adult: boolean;
  tagline: string;
  overview: string;
}

interface PersonInfo extends CommonDetails {
  name: string;
  character: string;
}

interface CastInfo {
  actors: PersonInfo[];
  director: Omit<PersonInfo, "character">[];
}

export interface MovieData extends MovieInfo {
  title: string;
}
    