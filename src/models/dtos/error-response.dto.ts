export class ErrorResponse {

    /**
     * Error detail. Intended for developers.
     */
    public error: string;

    /**
     * User-friendly error. Intended for users
     */
    public message: string;

    /**
     * HTTP status code.
     */
    public statusCode: number;

}
