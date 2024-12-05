export interface IOneTimePasswordRepository {
    generate(): string;
    save(email: string, otp: string, signal?: AbortSignal): Promise<void>;
    sendToEmail(email: string, otp: string, signal?: AbortSignal): Promise<void>;
    sendToEmailWithCustomValues(
        email: string,
        otp: string,
        subject: string,
        content: string,
        signal?: AbortSignal,
    ): Promise<void>;
    validate(email: string, otp: string, signal?: AbortSignal): Promise<boolean>;
}
