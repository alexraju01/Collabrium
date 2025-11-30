interface BaseResponse {
	status: ApiStatus;
	message?: string;
	results?: number;
	data: any;
}

type ApiStatus = "Success" | "Fail";
