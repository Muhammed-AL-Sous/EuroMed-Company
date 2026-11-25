<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDoctorRequest;
use App\Http\Requests\UpdateDoctorRequest;
use App\Http\Resources\DoctorResource;
use App\Models\Doctor;
use App\Services\DoctorService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected DoctorService $doctorService
    ) {}


    public function index(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search' => ['sometimes', 'nullable', 'string', 'max:100'],
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);

        $doctors = Doctor::query()
            ->with(['user.roles'])
            ->when(
                filled($filters['search'] ?? null),
                function ($query) use ($filters) {
                    $terms = preg_split(
                        '/\s+/u',
                        trim($filters['search']),
                        -1,
                        PREG_SPLIT_NO_EMPTY
                    );

                    foreach ($terms as $term) {
                        $query->where(
                            'name',
                            'LIKE',
                            "%{$term}%"
                        );
                    }
                }
            )
            ->orderBy('name')
            ->orderBy('id')
            ->paginate($filters['per_page'] ?? 15);

        return $this->success(
            DoctorResource::collection($doctors)
        );
    }

    public function store(
        StoreDoctorRequest $request
    ): JsonResponse {
        $doctor = $this->doctorService->create(
            $request->validated()
        );

        return $this->created(
            new DoctorResource($doctor->load('user'))
        );
    }

    public function show(Doctor $doctor): JsonResponse
    {
        return $this->success(
            new DoctorResource($doctor->load('user.roles'))
        );
    }

    public function update(
        UpdateDoctorRequest $request,
        Doctor $doctor
    ): JsonResponse {
        $doctor = $this->doctorService->update(
            $doctor,
            $request->validated()
        );

        return $this->updated(
            new DoctorResource($doctor->load('user'))
        );
    }

    public function destroy(Doctor $doctor): JsonResponse
    {
        try {
            $this->doctorService->delete($doctor);

            return response()->json([
                'status' => true,
                'message' => 'Doctor Deleted Successfully.',
            ], 200);
        } catch (ConflictHttpException $exception) {

            return response()->json([
                'status' => false,
                'message' => $exception->getMessage(),
            ], 409);
        }
    }
}
