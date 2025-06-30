// src/models/UserModel.js
export default class User {
  constructor(
    public first_name: string,
    public last_name: string,
    public email: string,
    public username: string,
    public password: string,
    public permissions?: string[],
    public isValidated?: boolean
  ) {}
}
