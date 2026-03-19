<?php

namespace App\Entity;

use App\Enum\FormatMedicament;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
class Medicament
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['medicament:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['medicament:read', 'medicament:write'])]
    private ?string $nomCommercial = null;

    #[ORM\Column(length: 255)]
    #[Groups(['medicament:read', 'medicament:write'])]
    private ?string $nomMolecule = null;

    #[ORM\Column(length: 100)]
    #[Groups(['medicament:read', 'medicament:write'])]
    private ?string $dosage = null;

    #[ORM\Column(type: 'string', enumType: FormatMedicament::class)]
    #[Groups(['medicament:read', 'medicament:write'])]
    private FormatMedicament $forme = FormatMedicament::AUTRE;

    #[ORM\Column(length: 20)]
    #[Groups(['medicament:read', 'medicament:write'])]
    private ?string $codeATC = null;

    #[ORM\Column]
    #[Groups(['medicament:read', 'medicament:write'])]
    private bool $estGenerique = false;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['medicament:read', 'medicament:write'])]
    private ?string $contreIndications = null;

    public function getId(): ?int { return $this->id; }
    public function getNomCommercial(): ?string { return $this->nomCommercial; }
    public function setNomCommercial(string $nom): self { $this->nomCommercial = $nom; return $this; }
    public function getNomMolecule(): ?string { return $this->nomMolecule; }
    public function setNomMolecule(string $nom): self { $this->nomMolecule = $nom; return $this; }
    public function getDosage(): ?string { return $this->dosage; }
    public function setDosage(string $dosage): self { $this->dosage = $dosage; return $this; }
    public function getForme(): FormatMedicament { return $this->forme; }
    public function setForme(FormatMedicament $forme): self { $this->forme = $forme; return $this; }
    public function getCodeATC(): ?string { return $this->codeATC; }
    public function setCodeATC(string $code): self { $this->codeATC = $code; return $this; }
    public function isEstGenerique(): bool { return $this->estGenerique; }
    public function setEstGenerique(bool $gen): self { $this->estGenerique = $gen; return $this; }
    public function getContreIndications(): ?string { return $this->contreIndications; }
    public function setContreIndications(?string $ci): self { $this->contreIndications = $ci; return $this; }
}
