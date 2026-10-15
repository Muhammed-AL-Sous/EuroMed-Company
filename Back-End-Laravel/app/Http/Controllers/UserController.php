<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\DoctorService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected DoctorService $doctorService
    ) {}

    public function index(): JsonResponse
    {
        $users = User::with(['roles', 'doctor'])
            ->latest()
            ->paginate(15);

        return $this->success(
            UserResource::collection($users)
        );
    }

    public function manageUsers(): JsonResponse
    {
        $users = User::with(['roles', 'doctor'])
            ->latest()
            ->paginate(15);

        return $this->success(
            UserResource::collection($users),
            'Users Retrieved Successfully.'
        );
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = DB::transaction(function () use ($validated) {

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'expires_at' => $validated['expires_at'] ?? null,
                'is_active' => true,
                'email_verified_at' => now(),
            ]);

            $user->assignRole($validated['role']);

            if (
                $validated['role'] === 'doctor' &&
                isset($validated['doctor'])
            ) {
                $this->doctorService->createForUser(
                    $user,
                    $validated['doctor']
                );
            }

            return $user;
        });

        return $this->created(
            new UserResource(
                $user->load(['roles', 'doctor'])
            )
        );
    }

    public function show(User $user): JsonResponse
    {
        return $this->success(
            new UserResource(
                $user->load(['roles', 'doctor'])
            )
        );
    }

    public function showCurrentUser(): JsonResponse
    {
        $user = Auth::user();

        return $this->success(
            new UserResource(
                $user->load(['roles', 'doctor'])
            )
        );
    }

    public function update(
        UpdateUserRequest $request,
        User $user
    ): JsonResponse {
        $validated = $request->validated();

        DB::transaction(function () use ($user, $validated, $request) {

            // Prevent Changing Role For Existing Doctor
            if (
                isset($validated['role']) &&
                $validated['role'] !== 'doctor' &&
                $user->doctor()->exists()
            ) {
                throw ValidationException::withMessages([
                    'role' =>
                        'Cannot Change Role While Doctor Profile Exists.',
                ]);
            }

            // Prevent Changing Own Role
            if (
                isset($validated['role']) &&
                $user->id === $request->user()->id &&
                ! $user->hasRole($validated['role'])
            ) {
                throw ValidationException::withMessages([
                    'role' => 'You Cannot Change Your Own Role.',
                ]);
            }

            // Update Role
            if (array_key_exists('role', $validated)) {
                $user->syncRoles([$validated['role']]);
            }

            // Extract Doctor Profile
            $doctorData = $validated['doctor'] ?? null;

            unset(
                $validated['role'],
                $validated['doctor'],
                $validated['password_confirmation']
            );

            // Handle Password
            if (! empty($validated['password'])) {
                $validated['password'] =
                    Hash::make($validated['password']);
            } else {
                unset($validated['password']);
            }

            // Update User
            if ($validated !== []) {
                $user->update($validated);
            }

            // Create Or Update Doctor Profile
            if ($doctorData !== null) {

                if (! $user->hasRole('doctor')) {
                    throw ValidationException::withMessages([
                        'doctor' => 'User Must Have Doctor Role.',
                    ]);
                }

                $this->doctorService->saveForUser(
                    $user,
                    $doctorData
                );
            }
        });

        return $this->updated(
            new UserResource(
                $user->refresh()->load(['roles', 'doctor'])
            )
        );
    }

    public function destroy(
        Request $request,
        User $user
    ): JsonResponse {
        if ($request->user()->id === $user->id) {
            return $this->forbidden(
                "You Can't Delete Your Own Account."
            );
        }

        if ($user->doctor()->exists()) {
            return $this->forbidden(
                'Cannot Delete User With Doctor Profile.'
            );
        }

        $user->delete();

        return $this->deleted();
    }
}
