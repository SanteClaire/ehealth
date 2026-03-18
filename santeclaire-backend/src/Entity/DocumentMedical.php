<?php

namespace App\Entity;

use App\Repository\DocumentMedicalRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: DocumentMedicalRepository::class)]
#[ORM\HasLifecycleCallbacks]
class DocumentMedical
{
    public const TYPE_ORDONNANCE = 'ordonnance';
    public const TYPE_ANALYSE = 'analyse';
    public const TYPE_RADIO = 'radiographie';
    public const TYPE_COMPTE_RENDU = 'compte_rendu';
    public const TYPE_CERTIFICAT = 'certificat';
    public const TYPE_AUTRE = 'autre';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le nom du fichier est requis')]
    private ?string $nomFichier = null;

    #[ORM\Column(length: 255)]
    private ?string $nomOriginal = null;

    #[ORM\Column(length: 50)]
    private ?string $type = self::TYPE_AUTRE;

    #[ORM\Column(length: 100)]
    private ?string $mimeType = null;

    #[ORM\Column]
    private ?int $taille = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $contenuChiffre = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $cheminFichier = null;

    #[ORM\ManyToOne(targetEntity: Patient::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?Patient $patient = null;

    #[ORM\ManyToOne(targetEntity: Medecin::class)]
    #[ORM\JoinColumn(nullable: true)]
    private ?Medecin $medecin = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(type: 'date', nullable: true)]
    private ?\DateTimeInterface $dateDocument = null;

    #[ORM\Column(type: 'boolean')]
    private bool $estConfidentiel = false;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $resumeIA = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomFichier(): ?string
    {
        return $this->nomFichier;
    }

    public function setNomFichier(string $nomFichier): static
    {
        $this->nomFichier = $nomFichier;
        return $this;
    }

    public function getNomOriginal(): ?string
    {
        return $this->nomOriginal;
    }

    public function setNomOriginal(string $nomOriginal): static
    {
        $this->nomOriginal = $nomOriginal;
        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;
        return $this;
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(string $mimeType): static
    {
        $this->mimeType = $mimeType;
        return $this;
    }

    public function getTaille(): ?int
    {
        return $this->taille;
    }

    public function setTaille(int $taille): static
    {
        $this->taille = $taille;
        return $this;
    }

    public function getTailleFormatee(): string
    {
        $bytes = $this->taille;
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }
        return round($bytes, 2) . ' ' . $units[$i];
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getContenuChiffre(): ?string
    {
        return $this->contenuChiffre;
    }

    public function setContenuChiffre(?string $contenuChiffre): static
    {
        $this->contenuChiffre = $contenuChiffre;
        return $this;
    }

    public function getCheminFichier(): ?string
    {
        return $this->cheminFichier;
    }

    public function setCheminFichier(?string $cheminFichier): static
    {
        $this->cheminFichier = $cheminFichier;
        return $this;
    }

    public function getPatient(): ?Patient
    {
        return $this->patient;
    }

    public function setPatient(?Patient $patient): static
    {
        $this->patient = $patient;
        return $this;
    }

    public function getMedecin(): ?Medecin
    {
        return $this->medecin;
    }

    public function setMedecin(?Medecin $medecin): static
    {
        $this->medecin = $medecin;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getDateDocument(): ?\DateTimeInterface
    {
        return $this->dateDocument;
    }

    public function setDateDocument(?\DateTimeInterface $dateDocument): static
    {
        $this->dateDocument = $dateDocument;
        return $this;
    }

    public function isEstConfidentiel(): bool
    {
        return $this->estConfidentiel;
    }

    public function setEstConfidentiel(bool $estConfidentiel): static
    {
        $this->estConfidentiel = $estConfidentiel;
        return $this;
    }

    public function getResumeIA(): ?string
    {
        return $this->resumeIA;
    }

    public function setResumeIA(?string $resumeIA): static
    {
        $this->resumeIA = $resumeIA;
        return $this;
    }

    public static function getTypesDisponibles(): array
    {
        return [
            self::TYPE_ORDONNANCE => 'Ordonnance',
            self::TYPE_ANALYSE => 'Analyse médicale',
            self::TYPE_RADIO => 'Radiographie / Imagerie',
            self::TYPE_COMPTE_RENDU => 'Compte-rendu médical',
            self::TYPE_CERTIFICAT => 'Certificat médical',
            self::TYPE_AUTRE => 'Autre document',
        ];
    }
}
