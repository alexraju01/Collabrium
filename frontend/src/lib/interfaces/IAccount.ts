export interface CreateAccountRequest {
	/** Public display name of the account */
	displayName: string;

	/** Email the account is linked to */
	email: string;

	/** Password linked to the account */
	password: string;
}

export interface EditAccountRequest {
	/** Display name to update to */
	displayName: string;
}

export interface AccountResponse {
	/** Account UUID */
	id: string;

	/** Account display name */
	displayName: string;

	/** Account email */
	email: string;

	/** Date the account was created */
	createdAt: Date;
}
