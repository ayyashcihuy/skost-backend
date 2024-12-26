export interface IOneTimePasswordRepository {
    generate(): string;
    save(email: string, otp: string, signal?: AbortSignal): Promise<void>;
    validate(email: string, otp: string, signal?: AbortSignal): Promise<boolean>;
}
