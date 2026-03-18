<?php

namespace App\Service;

use App\Entity\DocumentMedical;

/**
 * Service de classification automatique des documents médicaux
 * Utilise l'IA pour catégoriser et résumer les documents
 * 
 * Note: L'implémentation complète avec OpenAI sera faite dans Sprint 3
 */
class ClassificationService
{
    private ?string $openAiApiKey;

    public function __construct(string $openAiApiKey = null)
    {
        $this->openAiApiKey = $openAiApiKey ?? $_ENV['OPENAI_API_KEY'] ?? null;
    }

    /**
     * Classifie automatiquement un document basé sur son contenu
     * 
     * @param string $content Le contenu textuel du document
     * @param string $filename Le nom du fichier (pour indices supplémentaires)
     * @return string Le type de document détecté
     */
    public function classifyDocument(string $content, string $filename = ''): string
    {
        // Classification basique par mots-clés (avant intégration IA)
        $contentLower = mb_strtolower($content . ' ' . $filename);

        $keywords = [
            DocumentMedical::TYPE_ORDONNANCE => ['ordonnance', 'prescription', 'médicament', 'posologie'],
            DocumentMedical::TYPE_ANALYSE => ['analyse', 'laboratoire', 'résultat', 'prélèvement', 'sang', 'urine'],
            DocumentMedical::TYPE_RADIO => ['radiographie', 'scanner', 'irm', 'échographie', 'imagerie'],
            DocumentMedical::TYPE_COMPTE_RENDU => ['compte-rendu', 'compte rendu', 'consultation', 'hospitalisation'],
            DocumentMedical::TYPE_CERTIFICAT => ['certificat', 'attestation', 'aptitude'],
        ];

        foreach ($keywords as $type => $words) {
            foreach ($words as $word) {
                if (str_contains($contentLower, $word)) {
                    return $type;
                }
            }
        }

        return DocumentMedical::TYPE_AUTRE;
    }

    /**
     * Génère un résumé IA du document
     * 
     * @param string $content Le contenu du document
     * @return string Le résumé généré
     */
    public function generateSummary(string $content): string
    {
        if (!$this->openAiApiKey) {
            return 'Résumé IA non disponible - clé API non configurée';
        }

        // TODO: Implémenter l'appel à OpenAI GPT-4 dans Sprint 3
        // Voir US-3.x pour l'implémentation complète

        return 'Résumé IA - À implémenter dans Sprint 3';
    }

    /**
     * Extrait les informations clés d'un document médical
     * 
     * @param string $content Le contenu du document
     * @return array Les informations extraites
     */
    public function extractKeyInfo(string $content): array
    {
        // TODO: Utiliser NLP pour extraire:
        // - Dates
        // - Noms de médicaments
        // - Dosages
        // - Noms de médecins
        // - Diagnostics

        return [
            'dates' => [],
            'medications' => [],
            'doctors' => [],
            'diagnoses' => [],
        ];
    }

    /**
     * Vérifie si le service IA est disponible
     */
    public function isAiAvailable(): bool
    {
        return !empty($this->openAiApiKey);
    }
}
