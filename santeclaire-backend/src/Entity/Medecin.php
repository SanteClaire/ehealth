<?php

namespace App\Entity;

use App\Repository\MedecinRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: MedecinRepository::class)]
class Medecin extends User
{
    #[ORM\Column(length: 50, nullable: true)]
    private ?string $numeroRPPS = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $specialite = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $adresseCabinet = null;

    #[ORM\Column(length: 20, nullable: true)]
    #[Assert\Regex(pattern: '/^[0-9\+\s]+$/', message: 'Le numéro de téléphone n\'est pas valide')]
    private ?string $telephoneCabinet = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $horaires = null;

    #[ORM\Column(type: 'boolean')]
    private bool $accepteNouveauxPatients = true;

    #[ORM\Column(type: 'decimal', precision: 6, scale: 2, nullable: true)]
    private ?string $tarifConsultation = null;

    public function __construct()
    {
        parent::__construct();
        $this->setRoles(['ROLE_MEDECIN']);
    }

    public function getNumeroRPPS(): ?string
    {
        return $this->numeroRPPS;
    }

    public function setNumeroRPPS(?string $numeroRPPS): static
    {
        $this->numeroRPPS = $numeroRPPS;
        return $this;
    }

    public function getSpecialite(): ?string
    {
        return $this->specialite;
    }

    public function setSpecialite(?string $specialite): static
    {
        $this->specialite = $specialite;
        return $this;
    }

    public function getAdresseCabinet(): ?string
    {
        return $this->adresseCabinet;
    }

    public function setAdresseCabinet(?string $adresseCabinet): static
    {
        $this->adresseCabinet = $adresseCabinet;
        return $this;
    }

    public function getTelephoneCabinet(): ?string
    {
        return $this->telephoneCabinet;
    }

    public function setTelephoneCabinet(?string $telephoneCabinet): static
    {
        $this->telephoneCabinet = $telephoneCabinet;
        return $this;
    }

    public function getHoraires(): ?string
    {
        return $this->horaires;
    }

    public function setHoraires(?string $horaires): static
    {
        $this->horaires = $horaires;
        return $this;
    }

    public function isAccepteNouveauxPatients(): bool
    {
        return $this->accepteNouveauxPatients;
    }

    public function setAccepteNouveauxPatients(bool $accepteNouveauxPatients): static
    {
        $this->accepteNouveauxPatients = $accepteNouveauxPatients;
        return $this;
    }

    public function getTarifConsultation(): ?string
    {
        return $this->tarifConsultation;
    }

    public function setTarifConsultation(?string $tarifConsultation): static
    {
        $this->tarifConsultation = $tarifConsultation;
        return $this;
    }

    public function getTitreComplet(): string
    {
        $titre = 'Dr. ' . $this->getFullName();
        if ($this->specialite) {
            $titre .= ' - ' . $this->specialite;
        }
        return $titre;
    }
}
