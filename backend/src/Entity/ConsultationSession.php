<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
class ConsultationSession
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['consultation:read'])]
    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['consultation:read', 'consultation:write'])]
    private ?\DateTimeImmutable $dateDebut = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['consultation:read', 'consultation:write'])]
    private ?\DateTimeImmutable $dateFin = null;

    #[ORM\Column]
    #[Groups(['consultation:read'])]
    private bool $estActive = true;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Patient $patient = null;

    #[ORM\ManyToOne(targetEntity: Medecin::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Medecin $medecin = null;

    public function getId(): ?int { return $this->id; }
    public function getDateDebut(): ?\DateTimeImmutable { return $this->dateDebut; }
    public function setDateDebut(\DateTimeImmutable $date): self { $this->dateDebut = $date; return $this; }
    public function getDateFin(): ?\DateTimeImmutable { return $this->dateFin; }
    public function setDateFin(?\DateTimeImmutable $date): self { $this->dateFin = $date; return $this; }
    public function isEstActive(): bool { return $this->estActive; }
    public function setEstActive(bool $active): self { $this->estActive = $active; return $this; }
    public function getPatient(): ?Patient { return $this->patient; }
    public function setPatient(Patient $patient): self { $this->patient = $patient; return $this; }
    public function getMedecin(): ?Medecin { return $this->medecin; }
    public function setMedecin(Medecin $medecin): self { $this->medecin = $medecin; return $this; }
}
