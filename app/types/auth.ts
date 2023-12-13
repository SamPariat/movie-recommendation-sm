interface IAuth {
  _id: string;
  name: string;
  email: string;
  __v: number;
}

interface ITokens {
  access_token: string;
  refresh_token: string;
}

export type { IAuth, ITokens };
