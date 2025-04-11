export default interface RequestUserInformations extends Request {
  user: {
    userId: string;
  };
}
