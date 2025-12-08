import { z } from "zod";

export const GitHubTokenSchema = z.string().regex(/^[0-9a-fA-F]{40}$/);
export const EmailSchema = z.string().email();

export function validateGitHubToken(input: string) {
	return GitHubTokenSchema.safeParse(input);
}
export function validateEmail(input: string) {
	return EmailSchema.safeParse(input);
}
