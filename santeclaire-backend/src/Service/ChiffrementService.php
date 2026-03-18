<?php

namespace App\Service;

/**
 * Service de chiffrement pour les documents médicaux
 * Utilise AES-256-GCM pour le chiffrement symétrique
 */
class ChiffrementService
{
    private const CIPHER = 'aes-256-gcm';
    private const TAG_LENGTH = 16;

    private string $encryptionKey;

    public function __construct(string $encryptionKey = null)
    {
        // En production, utiliser une variable d'environnement
        $this->encryptionKey = $encryptionKey ?? $_ENV['ENCRYPTION_KEY'] ?? hash('sha256', 'santeclaire_default_key', true);
    }

    /**
     * Chiffre des données avec AES-256-GCM
     * 
     * @param string $data Les données à chiffrer
     * @return string Les données chiffrées encodées en base64 (iv:tag:ciphertext)
     */
    public function encrypt(string $data): string
    {
        $iv = random_bytes(openssl_cipher_iv_length(self::CIPHER));
        $tag = '';

        $ciphertext = openssl_encrypt(
            $data,
            self::CIPHER,
            $this->encryptionKey,
            OPENSSL_RAW_DATA,
            $iv,
            $tag,
            '',
            self::TAG_LENGTH
        );

        if ($ciphertext === false) {
            throw new \RuntimeException('Échec du chiffrement');
        }

        // Format: base64(iv) : base64(tag) : base64(ciphertext)
        return base64_encode($iv) . ':' . base64_encode($tag) . ':' . base64_encode($ciphertext);
    }

    /**
     * Déchiffre des données
     * 
     * @param string $encryptedData Les données chiffrées (format iv:tag:ciphertext)
     * @return string Les données déchiffrées
     */
    public function decrypt(string $encryptedData): string
    {
        $parts = explode(':', $encryptedData);
        
        if (count($parts) !== 3) {
            throw new \InvalidArgumentException('Format de données chiffrées invalide');
        }

        [$ivBase64, $tagBase64, $ciphertextBase64] = $parts;

        $iv = base64_decode($ivBase64);
        $tag = base64_decode($tagBase64);
        $ciphertext = base64_decode($ciphertextBase64);

        $plaintext = openssl_decrypt(
            $ciphertext,
            self::CIPHER,
            $this->encryptionKey,
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );

        if ($plaintext === false) {
            throw new \RuntimeException('Échec du déchiffrement - données corrompues ou clé invalide');
        }

        return $plaintext;
    }

    /**
     * Chiffre un fichier et retourne le contenu chiffré
     * 
     * @param string $filePath Chemin vers le fichier à chiffrer
     * @return string Le contenu chiffré
     */
    public function encryptFile(string $filePath): string
    {
        if (!file_exists($filePath)) {
            throw new \InvalidArgumentException('Fichier non trouvé: ' . $filePath);
        }

        $content = file_get_contents($filePath);
        return $this->encrypt($content);
    }

    /**
     * Déchiffre et sauvegarde un fichier
     * 
     * @param string $encryptedData Les données chiffrées
     * @param string $outputPath Chemin de sortie
     */
    public function decryptToFile(string $encryptedData, string $outputPath): void
    {
        $content = $this->decrypt($encryptedData);
        file_put_contents($outputPath, $content);
    }

    /**
     * Génère une clé de chiffrement sécurisée
     * 
     * @return string La clé encodée en base64
     */
    public static function generateKey(): string
    {
        return base64_encode(random_bytes(32));
    }
}
