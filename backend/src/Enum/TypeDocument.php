<?php

namespace App\Enum;

enum TypeDocument: string
{
    case ORDONNANCE = 'ORDONNANCE';
    case ANALYSE = 'ANALYSE';
    case RADIOGRAPHIE = 'RADIOGRAPHIE';
    case COMPTE_RENDU = 'COMPTE_RENDU';
    case CERTIFICAT = 'CERTIFICAT';
    case AUTRE = 'AUTRE';
}
