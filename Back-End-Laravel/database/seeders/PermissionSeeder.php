<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1.  إعادة ضبط / تفريغ كاش الصلاحيات
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // 2. إنشاء الصلاحية أو جلبها إن كانت موجودة مسبقاً
        $permission = Permission::firstOrCreate(['name' => 'manage users']);

        // 3. جلب الـ Role وإسناد الكائن المباشر بدلاً من النص
        $admin = Role::findByName('admin');
        $admin->givePermissionTo($permission);
    }
}
