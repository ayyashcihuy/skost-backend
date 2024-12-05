import { Transporter } from "nodemailer";
import { createTransporter } from "../config/email";
import { IEmailRepository } from "../Interfaces/IEmailSender";
import { IEmail } from "../Models/EmailModel";
import { EmailSendError } from "../Errors/EmailSendError";

export class EmailRepository implements IEmailRepository {
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = createTransporter();
  }

  async sendEmail(email: IEmail): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.GMAIL_USER, // Sender's email address
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
