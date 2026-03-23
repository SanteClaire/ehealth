<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
class Medecin extends User
{
    #[ORM\Column(length: 11, unique: true)]
    #[Assert\NotBlank]
    #[Groups(['user:read', 'user:write'])]
    private ?string $numeroRPPS = null;

    #[ORM\Column(length: 100)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $specialite = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $adresseCabinet = null;

    #[ORM\Column(length: 20)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $telephoneCabinet = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?array $horaires = null;

    #[ORM\Column]
    #[Groups(['user:read', 'user:write'])]
    private bool $accepteNouveauxPatients = true;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $tarifConsultation = null;

    #[ORM\Column]
    #[Groups(['user:read'])]
    private bool $estValide = false;

    public function __construct()
    {
        parent::__construct();
        $this->roles = ['ROLE_MEDECIN'];
    }

    public function getNumeroRPPS(): ?string { return $this->numeroRPPS; }
    public function setNumeroRPPS(string $rpps): self { $this->numeroRPPS = $rpps; return $this; }
    public function getSpecialite(): ?string { return $this->specialite; }
    public function setSpecialite(string $spec): self { $this->specialite = $spec; return $this; }
    public function getAdresseCabinet(): ?string { return $this->adresseCabinet; }
    public function setAdresseCabinet(string $addr): self { $this->adresseCabinet = $addr; return $this; }
    public function getTelephoneCabinet(): ?string { return $this->telephoneCabinet; }
    public function setTelephoneCabinet(string $tel): self { $this->telephoneCabinet = $tel; return $this; }
    public function getHoraires(): ?array { return $this->horaires; }
    public function setHoraires(?array $horaires): self { $this->horaires = $horaires; return $this; }
    public function isAccepteNouveauxPatients(): bool { return $this->accepteNouveauxPatients; }
    public function setAccepteNouveauxPatients(bool $accepte): self { $this->accepteNouveauxPatients = $accepte; return $this; }
    public function getTarifConsultation(): ?string { return $this->tarifConsultation; }
    public function setTarifConsultation(?string $tarif): self { $this->tarifConsultation = $tarif; return $this; }
    public function isEstValide(): bool { return $this->estValide; }
    public function setEstValide(bool $valide): self { $this->estValide = $valide; return $this; }

    public function __toString(): string
    {
        return 'Dr. ' . $this->getFirstName() . ' ' . $this->getLastName();
    }
}
