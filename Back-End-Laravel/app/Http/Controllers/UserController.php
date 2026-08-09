<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    use ApiResponse;

    public function index(): JsonResponse
    {
        $users = User::with('roles')->latest()->paginate(15);

        return $this->success(UserResource::collection($users));
    }

    public function manageUsers(): JsonResponse
    {
        return $this->success(
            UserResource::collection(User::with('roles')->latest()->paginate(15)),
            'Users retrieved successfully.'
        );
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $validated['password'] = Hash::make($validated['password']);

        $validated['is_active'] = true;

        $validated['email_verified_at'] = now();

        $user = User::create($validated);

        $user->assignRole($validated['role']);

        return $this->created(new UserResource($user->load('roles')));
    }

    public function show(User $user): JsonResponse
    {
        return $this->success(new UserResource($user->load('roles')));
    }

    public function showCurrentUser(): JsonResponse
    {
        $user = Auth::user();

        return $this->success(new UserResource($user->load('roles')));
    }


    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $validated = $request->validated();

        if (array_key_exists('role', $validated)) {
            $user->syncRoles([$validated['role']]);
            unset($validated['role']);
        }
        // if (array_key_exists('role', $validated))
        // يتحقق: هل الطلب أرسل حقل role؟
        // يستخدم array_key_exists وليس isset لأن role قد يكون موجوداً في المصفوفة حتى لو قيمته null.
        // إذا لم يُرسل role في الطلب، يُتخطى هذا القسم ولا يُغيّر دور المستخدم.
        // 2. $user->syncRoles([$validated['role']])

        // من حزمة Spatie Laravel Permission.
        // syncRoles = مزامنة الأدوار: يحذف الأدوار القديمة ويضع الدور الجديد فقط.
        // القيمة داخل مصفوفة [...] لأن المستخدم قد يملك أكثر من دور نظرياً، لكن هنا نمرّر دوراً واحداً فقط.
        // مثال: إذا كان المستخدم doctor وأرسلت admin، يصبح admin فقط.
        // 3. unset($validated['role'])

        // يحذف role من $validated قبل $user->update($validated).
        // لماذا؟ لأن role ليس عموداً في جدول users؛ يُخزَّن في جداول Spatie (roles و model_has_roles).
        // إذا بقي في $validated، Laravel يحاول تحديث عمود غير موجود في users فيحدث خطأ.

        if (isset($validated['password']) && $validated['password'] !== null && $validated['password'] !== '') {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        if ($validated !== []) {
            $user->update($validated);
        }

        return $this->updated(new UserResource($user->load('roles')));
    }


    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            return $this->forbidden("You Can't Delete Your Own Account.");
        }

        $user->delete();

        return $this->deleted();
    }
}
