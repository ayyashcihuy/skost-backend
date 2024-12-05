import { IEmail } from "../Models/EmailModel";

export interface IEmailRepository {
  sendEmail(email: IEmail): Promise<void>;
}
