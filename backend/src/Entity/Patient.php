<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
class Patient extends User
{
    #[ORM\Column(length: 15, unique: true)]
    #[Assert\NotBlank]
    #[Groups(['user:read', 'user:write'])]
    private ?string $numeroSecuriteSociale = null;

    #[ORM\Column(type: 'date')]
    #[Assert\Type('\DateTimeInterface')]
    #[Groups(['user:read', 'user:write'])]
    private ?\DateTimeInterface $dateNaissance = null;

    #[ORM\Column(length: 255)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $adresse = null;

    #[ORM\Column(length: 20)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $telephone = null;

    #[ORM\Column(length: 5, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $groupeSanguin = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $allergies = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $antecedents = null;

    public function __construct()
    {
        parent::__construct();
        $this->roles = ['ROLE_PATIENT'];
    }

    public function getNumeroSecuriteSociale(): ?string { return $this->numeroSecuriteSociale; }
    public function setNumeroSecuriteSociale(string $nss): self { $this->numeroSecuriteSociale = $nss; return $this; }
    public function getDateNaissance(): ?\DateTimeInterface { return $this->dateNaissance; }
    public function setDateNaissance(\DateTimeInterface $date): self { $this->dateNaissance = $date; return $this; }
    public function getAdresse(): ?string { return $this->adresse; }
    public function setAdresse(string $adresse): self { $this->adresse = $adresse; return $this; }
    public function getTelephone(): ?string { return $this->telephone; }
    public function setTelephone(string $telephone): self { $this->telephone = $telephone; return $this; }
    public function getGroupeSanguin(): ?string { return $this->groupeSanguin; }
    public function setGroupeSanguin(?string $gs): self { $this->groupeSanguin = $gs; return $this; }
    public function getAllergies(): ?string { return $this->allergies; }
    public function setAllergies(?string $allergies): self { $this->allergies = $allergies; return $this; }
    public function getAntecedents(): ?string { return $this->antecedents; }
    public function setAntecedents(?string $antecedents): self { $this->antecedents = $antecedents; return $this; }

    public function __toString(): string
    {
        return $this->getFirstName() . ' ' . $this->getLastName();
    }
}
