export interface CreateAccountRequest {
	/** Public display name of the account */
	displayname: string;

	/** Email the account is linked to */
	email: string;

	/** Password linked to the account */
	password: string;
}

export interface EditAccountRequest {
	/** Display name to update to */
	displayname: string;
}

export interface AccountResponse {
	/** Account UUID */
	id: string;

	/** Account display name */
	displayname: string;

	/** Account email */
	email: string;

	/** Date the account was created */
	createdAt: Date;
}
