<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Mail\ContactMessageMail;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactController extends Controller
{
    public function store(
        StoreContactRequest $request
    ): JsonResponse {

        $data = $request->validated();

        try {
            Mail::to(
                config('mail.contact_to')
            )->send(
                new ContactMessageMail($data)
            );

            return response()->json([
                'success' => true,
                'message' => 'Your message has been sent successfully.',
            ], 200);
        } catch (Throwable $exception) {

            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'Unable to send your message. Please try again later.',
            ], 503);
        }
    }
}
