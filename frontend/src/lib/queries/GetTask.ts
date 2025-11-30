import { useQuery } from "@tanstack/react-query";
import type { TaskResponse } from "../interfaces/ITask";
import axios from "axios";

export function useGetTask(id: string) {
	const q = useQuery({
		queryKey: ["workspace" + id],
		queryFn: () => fetchTask(id),
	});

	return q;
}

async function fetchTask(id: string) {
	try {
		const url = `${import.meta.env.BASE_URL}/api/v1/task/${id}`;
		const req = await axios.get(url, { withCredentials: true });

		const res = req.data as BaseResponse;

		return res.data as TaskResponse;
	} catch (error) {
		throw error;
	}
}
