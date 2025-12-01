import type { AccountResponse } from "./IAccount";

export interface ActivityRequest {
	/** Parent Task UUID */
	parentId: string;

	/** UUID of the account creating the task */
	createdBy: string;

	/** Activity message */
	message: string;
}

export interface ActivityResponse {
	/** Activity UUID */
	id: string;

	/** Parent task UUID */
	parentId: string;

	/** Account that created the activity */
	createdBy: AccountResponse;

	/** Date the activity was created */
	createdAt: Date;

	/** Activity message */
	message: string;
}
