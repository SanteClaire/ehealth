<?php

namespace App\Service;

/**
 * Service OCR pour l'extraction de texte depuis les documents
 * Utilise Tesseract OCR en arrière-plan
 * 
 * Note: L'implémentation complète sera faite dans Sprint 4
 */
class OcrService
{
    private string $tesseractPath;
    private string $language;

    public function __construct(
        string $tesseractPath = '/usr/bin/tesseract',
        string $language = 'fra'
    ) {
        $this->tesseractPath = $tesseractPath;
        $this->language = $language;
    }

    /**
     * Extrait le texte d'une image
     * 
     * @param string $imagePath Chemin vers l'image
     * @return string Le texte extrait
     */
    public function extractText(string $imagePath): string
    {
        if (!file_exists($imagePath)) {
            throw new \InvalidArgumentException('Image non trouvée: ' . $imagePath);
        }

        // TODO: Implémenter avec Tesseract OCR dans Sprint 4
        // Exemple de commande:
        // tesseract image.png output -l fra

        return 'OCR non implémenté - Sprint 4';
    }

    /**
     * Extrait le texte d'un PDF
     * 
     * @param string $pdfPath Chemin vers le PDF
     * @return string Le texte extrait
     */
    public function extractFromPdf(string $pdfPath): string
    {
        if (!file_exists($pdfPath)) {
            throw new \InvalidArgumentException('PDF non trouvé: ' . $pdfPath);
        }

        // TODO: Convertir PDF en images puis OCR
        // Ou utiliser une librairie comme poppler-utils

        return 'OCR PDF non implémenté - Sprint 4';
    }

    /**
     * Vérifie si Tesseract est disponible
     */
    public function isAvailable(): bool
    {
        return file_exists($this->tesseractPath) && is_executable($this->tesseractPath);
    }

    /**
     * Liste les langues disponibles
     */
    public function getAvailableLanguages(): array
    {
        if (!$this->isAvailable()) {
            return [];
        }

        $output = shell_exec($this->tesseractPath . ' --list-langs 2>/dev/null');
        
        if (!$output) {
            return [];
        }

        $lines = explode("\n", trim($output));
        // Enlever la première ligne (header)
        array_shift($lines);
        
        return array_filter($lines);
    }
}
