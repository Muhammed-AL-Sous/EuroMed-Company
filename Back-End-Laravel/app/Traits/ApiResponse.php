<?php

namespace App\Traits;

use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Support\Collection;

trait ApiResponse
{
    public static function success(
        mixed $data = null,
        string $message = 'Success',
        int $code = 200,
        array $extraMeta = []
    ) {
        $response = [
            'status' => true,
            'message' => $message,
        ];

        /*
        |--------------------------------------------------------------------------
        | Paginated Resource Collection
        |--------------------------------------------------------------------------
        */
        if (
            $data instanceof AbstractPaginator ||
            (
                $data instanceof ResourceCollection &&
                $data->resource instanceof AbstractPaginator
            )
        ) {
            $paginator = $data instanceof AbstractPaginator
                ? $data
                : $data->resource;

            $response['meta'] = array_merge([
                'total_items' => $paginator->total(),
                'items_per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'total_pages' => $paginator->lastPage(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ], $extraMeta);

            $response['links'] = [
                'first_page' => $paginator->url(1),
                'last_page' => $paginator->url($paginator->lastPage()),
                'previous_page' => $paginator->previousPageUrl(),
                'next_page' => $paginator->nextPageUrl(),
            ];

            /*
            |--------------------------------------------------------------------------
            | Important
            |--------------------------------------------------------------------------
            | Resolve the Resource instead of using ->collection
            */
            $response['data'] = $data instanceof ResourceCollection
                ? $data->resolve(request())
                : $paginator->items();

            return response()->json($response, $code);
        }

        /*
        |--------------------------------------------------------------------------
        | Resource Collection
        |--------------------------------------------------------------------------
        */
        if ($data instanceof ResourceCollection) {
            $response['data'] = $data->resolve(request());

            $response['meta'] = array_merge([
                'total_items' => count($response['data']),
            ], $extraMeta);

            return response()->json($response, $code);
        }

        /*
        |--------------------------------------------------------------------------
        | Laravel Collection
        |--------------------------------------------------------------------------
        */
        if ($data instanceof Collection) {
            $response['data'] = $data;

            $response['meta'] = array_merge([
                'total_items' => $data->count(),
            ], $extraMeta);

            return response()->json($response, $code);
        }

        /*
        |--------------------------------------------------------------------------
        | Normal Data
        |--------------------------------------------------------------------------
        */
        $response['data'] = $data;

        return response()->json($response, $code);
    }

    public static function created(
        mixed $data = null,
        string $message = 'Created Successfully'
    ) {
        return self::success($data, $message, 201);
    }

    public static function updated(
        mixed $data = null,
        string $message = 'Updated Successfully'
    ) {
        return self::success($data, $message, 200);
    }

    public static function deleted(
        string $message = 'Deleted Successfully'
    ) {
        return self::success(null, $message, 200);
    }

    public static function error(
        string $message = 'Error',
        int $code = 400,
        mixed $errors = null
    ) {
        $response = [
            'status' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    public static function validationError(
        mixed $errors,
        string $message = 'Validation Failed'
    ) {
        return response()->json([
            'status' => false,
            'message' => $message,
            'errors' => $errors,
        ], 422);
    }

    public static function unauthorized(
        string $message = 'Unauthorized'
    ) {
        return self::error($message, 401);
    }

    public static function forbidden(
        string $message = 'Forbidden'
    ) {
        return self::error($message, 403);
    }

    public static function notFound(
        string $message = 'Resource Not Found'
    ) {
        return self::error($message, 404);
    }

    public static function tooManyRequests(
        string $message = 'Too Many Requests'
    ) {
        return self::error($message, 429);
    }

    public static function databaseError(
        string $message = 'Database Error',
        mixed $details = null
    ) {
        return self::error($message, 500, $details);
    }
}
