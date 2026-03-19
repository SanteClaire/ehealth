<?php

namespace App\Entity;

use App\Enum\NiveauAdmin;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
class Admin extends User
{
    #[ORM\Column(type: 'string', enumType: NiveauAdmin::class)]
    #[Groups(['user:read', 'user:write'])]
    private NiveauAdmin $niveau = NiveauAdmin::SUPPORT;

    #[ORM\Column(type: 'json')]
    #[Groups(['user:read', 'user:write'])]
    private array $permissions = [];

    #[ORM\Column(nullable: true)]
    #[Groups(['user:read'])]
    private ?\DateTimeInterface $dernierAudit = null;

    #[ORM\Column(type: 'json')]
    #[Groups(['user:read', 'user:write'])]
    private array $ipAutorisees = [];

    #[ORM\Column(type: 'datetime')]
    #[Groups(['user:read'])]
    private ?\DateTimeInterface $dateNomination = null;

    public function __construct()
    {
        parent::__construct();
        $this->roles = ['ROLE_ADMIN'];
        $this->dateNomination = new \DateTime();
    }

    public function getNiveau(): NiveauAdmin { return $this->niveau; }
    public function setNiveau(NiveauAdmin $niveau): self { $this->niveau = $niveau; return $this; }
    public function getPermissions(): array { return $this->permissions; }
    public function setPermissions(array $perms): self { $this->permissions = $perms; return $this; }
    public function getDernierAudit(): ?\DateTimeInterface { return $this->dernierAudit; }
    public function setDernierAudit(?\DateTimeInterface $date): self { $this->dernierAudit = $date; return $this; }
    public function getIpAutorisees(): array { return $this->ipAutorisees; }
    public function setIpAutorisees(array $ips): self { $this->ipAutorisees = $ips; return $this; }
    public function getDateNomination(): ?\DateTimeInterface { return $this->dateNomination; }
}
