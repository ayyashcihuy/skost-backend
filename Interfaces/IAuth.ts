export interface IAuth {
    login(email: string, password: string): Promise<{ accessToken: string, refreshToken: string }>;
    refresh(token: string): Promise<{ accessToken: string, refreshToken: string }>;
}