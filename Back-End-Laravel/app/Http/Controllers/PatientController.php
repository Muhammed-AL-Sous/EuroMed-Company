<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientRequest;
use App\Http\Requests\UpdatePatientRequest;
use App\Http\Resources\PatientResource;
use App\Models\Patient;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $patients = Patient::query()
            ->when(
                $request->filled('search'),
                function ($query) use ($request) {

                    $terms = preg_split('/\s+/', trim($request['search'])) ?: [];
                    $terms = array_values(array_filter($terms, fn($t) => $t !== ''));

                    $query->where(function ($qq) use ($terms) {
                        foreach ($terms as $term) {
                            $like = "%{$term}%";
                            $qq->where(function ($q3) use ($like) {
                                $q3
                                    // Search by Patient Name
                                    ->where('name', 'LIKE', $like);
                            });
                        }
                    });
                }
            )
            ->latest()
            ->paginate($request->integer('per_page', 10));

        return $this->success(
            PatientResource::collection($patients)
        );
    }

    public function store(StorePatientRequest $request): JsonResponse
    {
        $patient = Patient::create($request->validated());

        return self::created($patient);
    }

    public function show(Patient $patient): JsonResponse
    {
        return self::success($patient->load('operations'));
    }

    public function update(UpdatePatientRequest $request, Patient $patient): JsonResponse
    {
        $patient->update($request->validated());

        return self::updated($patient);
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $patient->delete();

        return self::deleted('Patient Deleted Successfully.');
    }
}
