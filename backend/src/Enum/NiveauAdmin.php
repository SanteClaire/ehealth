<?php

namespace App\Enum;

enum NiveauAdmin: string
{
    case SUPER_ADMIN = 'SUPER_ADMIN';
    case MODERATOR = 'MODERATOR';
    case SUPPORT = 'SUPPORT';
}
