import 'axios';

// * Extend the original AxiosRequestConfig interface
declare module 'axios' {
  export interface AxiosRequestConfig {
    /** // * Custom flag to prevent infinite refresh loop */
    _isRetry?: boolean;
  }
}