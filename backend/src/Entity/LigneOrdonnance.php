<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
class LigneOrdonnance
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['ordonnance:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['ordonnance:read'])]
    private ?int $quantite = null;

    #[ORM\Column(length: 255)]
    #[Groups(['ordonnance:read'])]
    private ?string $posologie = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['ordonnance:read'])]
    private ?string $duree = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['ordonnance:read'])]
    private ?string $instructions = null;

    #[ORM\Column]
    #[Groups(['ordonnance:read'])]
    private bool $isSubstituable = true;

    #[ORM\ManyToOne(targetEntity: Ordonnance::class, inversedBy: 'lignes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ordonnance $ordonnance = null;

    #[ORM\ManyToOne(targetEntity: Medicament::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Medicament $medicament = null;

    public function getId(): ?int { return $this->id; }
    public function getQuantite(): ?int { return $this->quantite; }
    public function setQuantite(int $qte): self { $this->quantite = $qte; return $this; }
    public function getPosologie(): ?string { return $this->posologie; }
    public function setPosologie(string $poso): self { $this->posologie = $poso; return $this; }
    public function getDuree(): ?string { return $this->duree; }
    public function setDuree(?string $duree): self { $this->duree = $duree; return $this; }
    public function getInstructions(): ?string { return $this->instructions; }
    public function setInstructions(?string $inst): self { $this->instructions = $inst; return $this; }
    public function isIsSubstituable(): bool { return $this->isSubstituable; }
    public function setIsSubstituable(bool $sub): self { $this->isSubstituable = $sub; return $this; }
    public function getOrdonnance(): ?Ordonnance { return $this->ordonnance; }
    public function setOrdonnance(Ordonnance $ord): self { $this->ordonnance = $ord; return $this; }
    public function getMedicament(): ?Medicament { return $this->medicament; }
    public function setMedicament(Medicament $med): self { $this->medicament = $med; return $this; }
}
