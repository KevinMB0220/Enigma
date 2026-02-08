import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { AppError, InternalError, isAppError } from './errors';

/**
 * Standard API response structure
 * @see docs/api/endpoints.md
 */
export interface ApiResponse<T> {
  data: T;
  error: null;
  meta?: ApiMeta;
}

export interface ApiErrorResponse {
  data: null;
  error: {
    message: string;
    code: string;
    fields?: Record<string, string>;
  };
}

export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(
  data: T,
  status = 200,
  meta?: ApiMeta
): NextResponse<ApiResponse<T>> {
  const body: ApiResponse<T> = {
    data,
    error: null,
    ...(meta && { meta }),
  };

  return NextResponse.json(body, { status });
}

/**
 * Create a paginated success response
 */
export function paginatedResponse<T>(
  data: T[],
  pagination: PaginationParams,
  status = 200
): NextResponse<ApiResponse<T[]>> {
  const { page, limit, total } = pagination;
  const totalPages = Math.ceil(total / limit);

  return successResponse(data, status, {
    page,
    limit,
    total,
    totalPages,
  });
}

/**
 * Create a standardized error response from an AppError
 */
export function errorResponse(error: AppError): NextResponse<ApiErrorResponse> {
  const json = error.toJSON();

  const body: ApiErrorResponse = {
    data: null,
    error: {
      message: json.error.message,
      code: json.error.code,
      ...(json.error.fields && { fields: json.error.fields }),
    },
  };

  return NextResponse.json(body, { status: error.statusCode });
}

/**
 * Handle unknown errors and convert to standardized response
 * Logs the error and returns a safe error response
 */
export function handleError(error: unknown): NextResponse<ApiErrorResponse> {
  if (isAppError(error)) {
    if (error.statusCode >= 500) {
      Sentry.captureException(error, {
        extra: { statusCode: error.statusCode, code: error.code },
      });
    }
    return errorResponse(error);
  }

  // Log and capture unexpected errors
  console.error('Unexpected error:', error);
  Sentry.captureException(error);

  // Return generic internal error for unknown errors
  return errorResponse(new InternalError());
}

/**
 * Type guard to check if a response is an error response
 */
export function isErrorResponse(
  response: ApiResponse<unknown> | ApiErrorResponse
): response is ApiErrorResponse {
  return response.error !== null;
}
