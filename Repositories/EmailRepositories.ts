import { Transporter } from "nodemailer";
import { IEmailRepository } from "../Interfaces/IEmailSender";
import { IEmail } from "../Models/EmailModel";
import { EmailSendError } from "../Errors/EmailSendError";

export class EmailRepository implements IEmailRepository {
  private readonly transporter: Transporter;
  private readonly fromAddress: string;

  constructor(formAddress: string, transporter: Transporter) {
    this.fromAddress = formAddress;
    this.transporter = transporter;
  }

  async sendEmail(email: IEmail): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: "Skost Management <" + this.fromAddress + ">", // Sender's email address
        to: email.to,
        subject: email.subject,
        html: email.body, // Email body (use `text` for plain text emails)
      });

      return;
    } catch (error) {
        throw new EmailSendError(`Failed to send email to ${email.to}`);
    }
  }
}
