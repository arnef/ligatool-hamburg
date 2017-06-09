import type { AxiosRequestConfig, AxiosInstance } from 'axios';

declare module 'apisauce' {
    declare type HEADERS = { [key: string]: string };

    declare export var DEFAULT_HEADERS: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    };

    declare export var NONE: null;
    declare export var CLIENT_ERROR: 'CLIENT_ERROR';
    declare export var SERVER_ERROR: 'SERVER_ERROR';
    declare export var TIMEOUT_ERROR: 'TIMEOUT_ERROR';
    declare export var CONNECTION_ERROR: 'CONNECTION_ERROR';
    declare export var NETWORK_ERROR: 'NETWORK_ERROR';
    declare export var UNKNOWN_ERROR: 'UNKNOWN_ERROR';
    declare export var CANCEL_ERROR: 'CANCEL_ERROR';

    declare type PROBLEM_CODE =
        | 'CLIENT_ERROR'
        | 'SERVER_ERROR'
        | 'TIMEOUT_ERROR'
        | 'CONNECTION_ERROR'
        | 'NETWORK_ERROR'
        | 'UNKNOWN_ERROR'
        | 'CANCEL_ERROR';

    declare interface ApisauceConfig extends AxiosRequestConfig {
        baseURL: string;
    }

    declare type ApiErrorResponse<T> = {
        ok: false;
        problem: PROBLEM_CODE;

        data?: T;
        status?: number;
        headers?: {};
        config?: AxiosRequestConfig;
        duration?: number;
    };
    declare type ApiOkResponse<T> = {
        ok: true;
        problem: null;

        data?: T;
        status?: number;
        headers?: {};
        config?: AxiosRequestConfig;
        duration?: number;
    };
    declare type ApiResponse<T> = ApiErrorResponse<T> | ApiOkResponse<T>;

    declare type Monitor = (response: ApiResponse<any>) => void;
    declare type RequestTransform = (request: AxiosRequestConfig) => void;
    declare type AsyncRequestTransform = (request: AxiosRequestConfig) => (Promise<void> | ((request: AxiosRequestConfig) => Promise<void>));
    declare type ResponseTransform = (response: ApiResponse<any>) => void;

    declare interface ApisauceInstance {
        axiosInstance: AxiosInstance;

        monitors: Monitor;
        addMonitor: (monitor: Monitor) => void;

        requestTransforms: RequestTransform[];
        asyncRequestTransforms: AsyncRequestTransform[];
        responseTransforms: ResponseTransform[];
        addRequestTransform: (transform: RequestTransform) => void;
        addAsyncRequestTransform: (transform: AsyncRequestTransform) => void;
        addResponseTransforms: (transform: ResponseTransform) => void;

        headers: HEADERS;
        setHeader: (key: string, value: string) => AxiosInstance;
        setHeaders: (headers: [[string, string]]) => AxiosInstance;
        deleteHeader: (name: string) => AxiosInstance;

        /** Sets a new base URL */
        setBaseURL: (baseUrl: string) => AxiosInstance;
        /** Gets the current base URL used by axios */
        getBaseURL: () => string;

        get: <T>(url: string, params?: {}, axiosConfig?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
        delete: <T>(url: string, params?: {}, axiosConfig?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
        head: <T>(url: string, params?: {}, axiosConfig?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
        post: <T>(url: string, data?: any, axiosConfig?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
        put: <T>(url: string, data?: any, axiosConfig?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
        patch: <T>(url: string, data?: any, axiosConfig?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
        link: <T>(url: string, params?: {}, axiosConfig?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
        unlink: <T>(url: string, params?: {}, axiosConfig?: AxiosRequestConfig) => Promise<ApiResponse<T>>;
    }

    /**
     * Creates a instance of our API using the configuration
     * @param config a configuration object which must have a non-empty 'baseURL' property.
     */
    declare export function create(config: ApisauceConfig): ApisauceInstance;

    declare export default {
        DEFAULT_HEADERS: typeof DEFAULT_HEADERS;
        NONE: typeof NONE;
        CLIENT_ERROR: typeof CLIENT_ERROR;
        SERVER_ERROR: typeof SERVER_ERROR;
        TIMEOUT_ERROR: typeof TIMEOUT_ERROR;
        CONNECTION_ERROR: typeof CONNECTION_ERROR;
        NETWORK_ERROR: typeof NETWORK_ERROR;
        UNKNOWN_ERROR: typeof UNKNOWN_ERROR;
        create: create;
    }
}