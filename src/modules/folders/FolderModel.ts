// src/models/FolderModel.js
export default class Folder {
  constructor(
    public id: number,
    public name: string,
    public reception_email: string,
    public document_type: string,
    public retention_duration: number,
    public status: FolderStatus,
    public created_at: string,
    public updatedAt: string,
    public document_count: number,
    public language: string,
    public description: string
  ) {}
}

export type FolderStatus = "active" | "archived";

export class FolderCreateDto {
  constructor(
    public name: string,
    public receptionEmail: string,
    public documentType: string,
    public retentionDuration: string,
    public status: string,
    public language: string
  ) {}
}
