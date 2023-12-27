type Auth = {
  _id: string;
  name: string;
  email: string;
  __v: number;
};

type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type { Auth, Tokens };
