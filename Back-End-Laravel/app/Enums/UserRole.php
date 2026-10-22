<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case STAFF = 'staff';
    case DOCTOR = 'doctor';
    case Employee = 'employee';
}
