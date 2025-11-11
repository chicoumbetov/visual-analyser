import { AxiosError } from "axios";

export const getContentType = () => ({
	'Content-type': 'application/json'
})

export interface ErrorResponseData {
    message: string | string[];
}

export const errorCatch = <T = ErrorResponseData>(error: AxiosError<T>): string => {
	   const data = error.response?.data as T | undefined;
    const message = (data as ErrorResponseData)?.message; 

	return message
        ? typeof message === 'object' && Array.isArray(message)
            ? message[0]
            : message
        : error.message
}
