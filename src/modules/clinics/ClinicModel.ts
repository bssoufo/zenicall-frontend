export default class Clinic {
  constructor(
    public id: string,
    public name: string,
    public created_at: string,
    public updated_at: string
  ) {}
}

export class ClinicCreateDto {
  constructor(public name: string) {}
}