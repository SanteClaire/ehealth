<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
class Dossier
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['dossier:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['dossier:read', 'dossier:write'])]
    private ?string $nom = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['dossier:read', 'dossier:write'])]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['dossier:read', 'dossier:write'])]
    private ?string $lienParents = null;

    #[ORM\OneToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Patient $patient = null;

    public function getId(): ?int { return $this->id; }
    public function getNom(): ?string { return $this->nom; }
    public function setNom(string $nom): self { $this->nom = $nom; return $this; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $desc): self { $this->description = $desc; return $this; }
    public function getLienParents(): ?string { return $this->lienParents; }
    public function setLienParents(?string $lien): self { $this->lienParents = $lien; return $this; }
    public function getPatient(): ?Patient { return $this->patient; }
    public function setPatient(Patient $patient): self { $this->patient = $patient; return $this; }
}
