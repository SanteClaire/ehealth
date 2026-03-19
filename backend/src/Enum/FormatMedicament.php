<?php

namespace App\Enum;

enum FormatMedicament: string
{
    case COMPRIME = 'COMPRIME';
    case GELULE = 'GELULE';
    case SIROP = 'SIROP';
    case INJECTION = 'INJECTION';
    case POMMADE = 'POMMADE';
    case COLLYRE = 'COLLYRE';
    case SUPPOSITOIRE = 'SUPPOSITOIRE';
    case PATCH = 'PATCH';
    case SPRAY = 'SPRAY';
    case AUTRE = 'AUTRE';
}
