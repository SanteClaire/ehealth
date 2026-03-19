<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
class Ordonnance
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['ordonnance:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50, unique: true)]
    #[Groups(['ordonnance:read'])]
    private ?string $numero = null;

    #[ORM\Column(type: 'date')]
    #[Groups(['ordonnance:read'])]
    private ?\DateTimeInterface $dateEmission = null;

    #[ORM\Column(type: 'date')]
    #[Groups(['ordonnance:read'])]
    private ?\DateTimeInterface $dateExpiration = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['ordonnance:read'])]
    private ?string $instructions = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $signature = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $qrCode = null;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Patient $patient = null;

    #[ORM\ManyToOne(targetEntity: Medecin::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Medecin $medecin = null;

    #[ORM\OneToMany(mappedBy: 'ordonnance', targetEntity: LigneOrdonnance::class, cascade: ['persist', 'remove'])]
    private Collection $lignes;

    public function __construct()
    {
        $this->dateEmission = new \DateTime();
        $this->lignes = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }
    public function getNumero(): ?string { return $this->numero; }
    public function setNumero(string $num): self { $this->numero = $num; return $this; }
    public function getDateEmission(): ?\DateTimeInterface { return $this->dateEmission; }
    public function getDateExpiration(): ?\DateTimeInterface { return $this->dateExpiration; }
    public function setDateExpiration(\DateTimeInterface $date): self { $this->dateExpiration = $date; return $this; }
    public function getInstructions(): ?string { return $this->instructions; }
    public function setInstructions(?string $inst): self { $this->instructions = $inst; return $this; }
    public function getSignature(): ?string { return $this->signature; }
    public function setSignature(?string $sig): self { $this->signature = $sig; return $this; }
    public function getQrCode(): ?string { return $this->qrCode; }
    public function setQrCode(?string $qr): self { $this->qrCode = $qr; return $this; }
    public function getPatient(): ?Patient { return $this->patient; }
    public function setPatient(Patient $patient): self { $this->patient = $patient; return $this; }
    public function getMedecin(): ?Medecin { return $this->medecin; }
    public function setMedecin(Medecin $medecin): self { $this->medecin = $medecin; return $this; }
    public function getLignes(): Collection { return $this->lignes; }
}
