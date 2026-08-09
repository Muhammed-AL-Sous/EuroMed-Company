<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMIN = 'admin';
    case DATA_ENTRY = 'data_entry';
    case DOCTOR = 'doctor';
    case Employee = 'employee';
}
