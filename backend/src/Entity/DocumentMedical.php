<?php

namespace App\Entity;

use App\Enum\TypeDocument;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity]
class DocumentMedical
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['document:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['document:read', 'document:write'])]
    private ?string $nomFichier = null;

    #[ORM\Column(length: 255)]
    #[Groups(['document:read', 'document:write'])]
    private ?string $nomOriginal = null;

    #[ORM\Column(type: 'string', enumType: TypeDocument::class)]
    #[Groups(['document:read', 'document:write'])]
    private TypeDocument $type = TypeDocument::AUTRE;

    #[ORM\Column(length: 100)]
    #[Groups(['document:read'])]
    private ?string $mimeType = null;

    #[ORM\Column]
    #[Groups(['document:read'])]
    private ?int $taille = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $contenuChiffre = null;

    #[ORM\Column]
    #[Groups(['document:read', 'document:write'])]
    private bool $estConfidentiel = false;

    #[ORM\Column]
    #[Groups(['document:read', 'document:write'])]
    private bool $estPartage = true;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['document:read'])]
    private ?string $resumeIA = null;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Patient $patient = null;

    #[ORM\ManyToOne(targetEntity: Medecin::class)]
    private ?Medecin $createurMedecin = null;

    public function getId(): ?int { return $this->id; }
    public function getNomFichier(): ?string { return $this->nomFichier; }
    public function setNomFichier(string $nom): self { $this->nomFichier = $nom; return $this; }
    public function getNomOriginal(): ?string { return $this->nomOriginal; }
    public function setNomOriginal(string $nom): self { $this->nomOriginal = $nom; return $this; }
    public function getType(): TypeDocument { return $this->type; }
    public function setType(TypeDocument $type): self { $this->type = $type; return $this; }
    public function getMimeType(): ?string { return $this->mimeType; }
    public function setMimeType(string $mime): self { $this->mimeType = $mime; return $this; }
    public function getTaille(): ?int { return $this->taille; }
    public function setTaille(int $taille): self { $this->taille = $taille; return $this; }
    public function getContenuChiffre(): ?string { return $this->contenuChiffre; }
    public function setContenuChiffre(?string $contenu): self { $this->contenuChiffre = $contenu; return $this; }
    public function isEstConfidentiel(): bool { return $this->estConfidentiel; }
    public function setEstConfidentiel(bool $conf): self { $this->estConfidentiel = $conf; return $this; }
    public function isEstPartage(): bool { return $this->estPartage; }
    public function setEstPartage(bool $partage): self { $this->estPartage = $partage; return $this; }
    public function getResumeIA(): ?string { return $this->resumeIA; }
    public function setResumeIA(?string $resume): self { $this->resumeIA = $resume; return $this; }
    public function getPatient(): ?Patient { return $this->patient; }
    public function setPatient(Patient $patient): self { $this->patient = $patient; return $this; }
    public function getCreateurMedecin(): ?Medecin { return $this->createurMedecin; }
    public function setCreateurMedecin(?Medecin $medecin): self { $this->createurMedecin = $medecin; return $this; }
}
