export class ErrorFetchingTrendingInfo extends Error {
  message: string;
  name: string;

  constructor(message: string) {
    super(message);

    this.message = message;
    this.name = "ErrorFetchingTrendingInfo";
  }
}
