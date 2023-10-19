interface CommonDetails {
  imagePath: string;
}

interface MovieInfo extends CommonDetails {
  adult: boolean;
  tagline: string;
}

interface PersonInfo extends CommonDetails {
  name: string;
  character: string;
}

interface CastInfo {
  actors: PersonInfo[];
  director: Omit<PersonInfo, "character">[];
}

interface MovieData extends MovieInfo {
  title: string;
}
