<?php

namespace App\Controller\Api;

use App\Entity\Ordonnance;
use App\Entity\Patient;
use App\Entity\Medecin;
use Doctrine\ORM\EntityManagerInterface;
use Dompdf\Dompdf;
use Dompdf\Options;
use App\Entity\ConsultationSession;
use App\Entity\DocumentMedical;
use App\Entity\Dossier;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class OrdonnancePdfController extends AbstractApiController
{
    public function __construct(
        private EntityManagerInterface $em
    ) {}

    #[Route('/ordonnance/{id}/pdf', name: 'api_ordonnance_pdf', methods: ['GET'])]
    public function generatePdf(int $id): Response
    {
        $user = $this->getUser();
        if (!$user) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $ordonnance = $this->em->getRepository(Ordonnance::class)->find($id);
        if (!$ordonnance) {
            return new JsonResponse(['error' => 'Ordonnance non trouvée'], 404);
        }

        // Access check: patient can see their own, medecin can see ones they prescribed
        $patient = $ordonnance->getPatient();
        $medecin = $ordonnance->getMedecin();

        if ($user instanceof Patient && $user->getId() !== $patient->getId()) {
            return new JsonResponse(['error' => 'Accès refusé'], 403);
        }
        if ($user instanceof Medecin && $user->getId() !== $medecin->getId()) {
            return new JsonResponse(['error' => 'Accès refusé'], 403);
        }

        // Build HTML
        $lignesHtml = '';
        foreach ($ordonnance->getLignes() as $ligne) {
            $med = $ligne->getMedicament();
            $lignesHtml .= sprintf(
                '<tr>
                    <td style="padding:8px;border-bottom:1px solid #E5E7EB"><strong>%s</strong><br><span style="color:#6B7280;font-size:12px">%s — %s</span></td>
                    <td style="padding:8px;border-bottom:1px solid #E5E7EB">%s</td>
                    <td style="padding:8px;border-bottom:1px solid #E5E7EB">%s</td>
                    <td style="padding:8px;border-bottom:1px solid #E5E7EB">%s</td>
                </tr>',
                htmlspecialchars($med->getNomCommercial()),
                htmlspecialchars($med->getNomMolecule()),
                htmlspecialchars($med->getDosage()),
                htmlspecialchars($ligne->getPosologie()),
                htmlspecialchars($ligne->getDuree() ?? '—'),
                $ligne->getQuantite() . ' boîte(s)'
            );
        }

        $html = sprintf('
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><style>
    body { font-family: DejaVu Sans, sans-serif; color: #1F2937; margin: 0; padding: 30px; font-size: 13px; }
    .header { display: flex; justify-content: space-between; border-bottom: 3px solid #0EA5B0; padding-bottom: 20px; margin-bottom: 20px; }
    .logo { font-size: 22px; font-weight: bold; color: #0F2445; }
    .logo span { color: #0EA5B0; }
    .badge { background: #E0F7F9; color: #0EA5B0; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; }
    .doctor-info { text-align: right; font-size: 12px; color: #6B7280; }
    .doctor-name { font-size: 16px; color: #0F2445; font-weight: 600; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9CA3AF; margin-bottom: 8px; font-weight: 600; }
    .patient-box { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 8px; padding: 14px; }
    .patient-name { font-size: 16px; font-weight: 600; color: #0F2445; }
    .patient-detail { font-size: 12px; color: #6B7280; margin-top: 4px; }
    table { width: 100%%; border-collapse: collapse; margin-top: 10px; }
    th { background: #F3F4F6; padding: 8px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #6B7280; }
    .instructions { background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; padding: 12px; margin-top: 16px; }
    .instructions strong { color: #D97706; }
    .footer { margin-top: 30px; border-top: 2px solid #E5E7EB; padding-top: 15px; font-size: 11px; color: #9CA3AF; text-align: center; }
    .numero { font-size: 12px; color: #0EA5B0; font-weight: 600; }
    .dates { font-size: 12px; color: #6B7280; }
</style></head>
<body>
    <div class="header">
        <div>
            <div class="logo">Santé<span>Claire</span></div>
            <div style="margin-top:6px"><span class="badge">Plateforme certifiée HDS — Conforme RGPD</span></div>
        </div>
        <div class="doctor-info">
            <div class="doctor-name">Dr. %s %s</div>
            <div>%s</div>
            <div>RPPS : %s</div>
            <div>%s</div>
            <div>Tél : %s</div>
        </div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div>
            <span style="font-size:18px;font-weight:700;color:#0F2445">ORDONNANCE MÉDICALE</span>
            <div class="numero">%s</div>
        </div>
        <div class="dates">
            Émise le : %s<br>
            Expire le : %s
        </div>
    </div>

    <div class="section">
        <div class="section-title">Patient</div>
        <div class="patient-box">
            <div class="patient-name">%s %s</div>
            <div class="patient-detail">
                Né(e) le %s — N° SS : %s<br>
                %s — Tél : %s
                %s
                %s
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Prescription</div>
        <table>
            <thead>
                <tr>
                    <th>Médicament</th>
                    <th>Posologie</th>
                    <th>Durée</th>
                    <th>Quantité</th>
                </tr>
            </thead>
            <tbody>%s</tbody>
        </table>
    </div>

    %s

    <div class="footer">
        <strong>SantéClaire</strong> — Plateforme de santé certifiée HDS<br>
        Document généré automatiquement le %s — Ne pas modifier
    </div>
</body>
</html>',
            htmlspecialchars($medecin->getFirstName()),
            htmlspecialchars($medecin->getLastName()),
            htmlspecialchars($medecin->getSpecialite()),
            htmlspecialchars($medecin->getNumeroRPPS()),
            htmlspecialchars($medecin->getAdresseCabinet()),
            htmlspecialchars($medecin->getTelephoneCabinet() ?? ''),
            htmlspecialchars($ordonnance->getNumero()),
            $ordonnance->getDateEmission()->format('d/m/Y'),
            $ordonnance->getDateExpiration()->format('d/m/Y'),
            htmlspecialchars($patient->getFirstName()),
            htmlspecialchars($patient->getLastName()),
            $patient->getDateNaissance()->format('d/m/Y'),
            htmlspecialchars($patient->getNumeroSecuriteSociale()),
            htmlspecialchars($patient->getAdresse()),
            htmlspecialchars($patient->getTelephone()),
            $patient->getGroupeSanguin() ? '<br>Groupe sanguin : ' . htmlspecialchars($patient->getGroupeSanguin()) : '',
            $patient->getAllergies() ? '<br><span style="color:#EF4444">⚠ Allergies : ' . htmlspecialchars($patient->getAllergies()) . '</span>' : '',
            $lignesHtml,
            $ordonnance->getInstructions() ? '<div class="instructions"><strong>⚠ Instructions :</strong> ' . htmlspecialchars($ordonnance->getInstructions()) . '</div>' : '',
            (new \DateTime())->format('d/m/Y à H:i')
        );

        $options = new Options();
        $options->set('isRemoteEnabled', false);
        $options->set('defaultFont', 'DejaVu Sans');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $filename = 'Ordonnance_' . $ordonnance->getNumero() . '.pdf';

        return new Response(
            $dompdf->output(),
            200,
            [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . $filename . '"',
                'Access-Control-Allow-Origin' => '*',
            ]
        );
    }

    #[Route('/medecin/patient/{id}/compte-rendu', name: 'api_compte_rendu_pdf', methods: ['GET'])]
    public function generateCompteRendu(int $id): Response
    {
        $user = $this->getUser();
        if (!$user instanceof Medecin) {
            return new JsonResponse(['error' => 'Accès refusé'], 403);
        }

        $patient = $this->em->getRepository(Patient::class)->find($id);
        if (!$patient) return new JsonResponse(['error' => 'Patient non trouvé'], 404);

        $consultations = $this->em->getRepository(ConsultationSession::class)
            ->findBy(['medecin' => $user, 'patient' => $patient], ['dateDebut' => 'DESC']);
        $documents = $this->em->getRepository(DocumentMedical::class)
            ->findBy(['patient' => $patient], ['id' => 'DESC']);
        $ordonnances = $this->em->getRepository(Ordonnance::class)
            ->findBy(['patient' => $patient], ['dateEmission' => 'DESC']);

        $consultHtml = '';
        foreach ($consultations as $c) {
            $status = $c->isEstActive() ? 'En cours' : 'Terminée';
            $duree = $c->getDateFin() ? round((strtotime($c->getDateFin()->format('Y-m-d H:i:s')) - strtotime($c->getDateDebut()->format('Y-m-d H:i:s'))) / 60) . ' min' : '—';
            $consultHtml .= sprintf('<tr><td style="padding:6px;border-bottom:1px solid #E5E7EB">%s</td><td style="padding:6px;border-bottom:1px solid #E5E7EB">%s</td><td style="padding:6px;border-bottom:1px solid #E5E7EB">%s</td></tr>',
                $c->getDateDebut()->format('d/m/Y H:i'), $status, $duree);
        }

        $docsHtml = '';
        foreach ($documents as $d) {
            $docsHtml .= sprintf('<tr><td style="padding:6px;border-bottom:1px solid #E5E7EB">%s</td><td style="padding:6px;border-bottom:1px solid #E5E7EB">%s</td><td style="padding:6px;border-bottom:1px solid #E5E7EB;font-size:11px;color:#6B7280">%s</td></tr>',
                htmlspecialchars($d->getNomOriginal()), $d->getType()->value, htmlspecialchars($d->getResumeIA() ?? '—'));
        }

        $ordHtml = '';
        foreach ($ordonnances as $o) {
            $lignes = [];
            foreach ($o->getLignes() as $l) {
                $lignes[] = $l->getMedicament()->getNomCommercial() . ' ' . $l->getMedicament()->getDosage() . ' — ' . $l->getPosologie();
            }
            $ordHtml .= sprintf('<tr><td style="padding:6px;border-bottom:1px solid #E5E7EB">%s</td><td style="padding:6px;border-bottom:1px solid #E5E7EB">%s</td><td style="padding:6px;border-bottom:1px solid #E5E7EB">%s</td></tr>',
                htmlspecialchars($o->getNumero()), $o->getDateEmission()->format('d/m/Y'), implode('<br>', array_map('htmlspecialchars', $lignes)) ?: '—');
        }

        $age = (new \DateTime())->diff($patient->getDateNaissance())->y;

        $html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
            body { font-family: DejaVu Sans, sans-serif; color: #1F2937; padding: 30px; font-size: 12px; }
            .header { border-bottom: 3px solid #0EA5B0; padding-bottom: 15px; margin-bottom: 20px; }
            .logo { font-size: 20px; font-weight: bold; color: #0F2445; }
            .logo span { color: #0EA5B0; }
            h2 { color: #0F2445; font-size: 14px; margin: 20px 0 8px; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th { background: #F3F4F6; padding: 6px; text-align: left; font-size: 10px; text-transform: uppercase; color: #6B7280; }
            .info { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 6px; padding: 12px; margin-bottom: 15px; }
            .alert { background: #FEF2F2; border: 1px solid #FECACA; border-radius: 6px; padding: 10px; color: #DC2626; margin: 8px 0; font-size: 11px; }
            .footer { margin-top: 25px; border-top: 2px solid #E5E7EB; padding-top: 12px; font-size: 10px; color: #9CA3AF; text-align: center; }
        </style></head><body>
        <div class="header">
            <div class="logo">Santé<span>Claire</span> — Compte-rendu médical</div>
            <div style="font-size:11px;color:#6B7280;margin-top:4px">Généré le ' . (new \DateTime())->format('d/m/Y à H:i') . ' par Dr. ' . htmlspecialchars($user->getFirstName() . ' ' . $user->getLastName()) . ' — ' . htmlspecialchars($user->getSpecialite()) . '</div>
        </div>

        <div class="info">
            <strong style="font-size:16px;color:#0F2445">' . htmlspecialchars($patient->getFirstName() . ' ' . $patient->getLastName()) . '</strong><br>
            ' . $age . ' ans — Groupe sanguin : ' . htmlspecialchars($patient->getGroupeSanguin() ?? '—') . '<br>
            N° SS : ' . htmlspecialchars($patient->getNumeroSecuriteSociale()) . '<br>
            ' . htmlspecialchars($patient->getAdresse()) . ' — Tél : ' . htmlspecialchars($patient->getTelephone()) . '
            ' . ($patient->getAllergies() ? '<div class="alert">⚠ ALLERGIES : ' . htmlspecialchars($patient->getAllergies()) . '</div>' : '') . '
            ' . ($patient->getAntecedents() ? '<div style="margin-top:6px;font-size:11px"><strong>Antécédents :</strong> ' . htmlspecialchars($patient->getAntecedents()) . '</div>' : '') . '
        </div>

        <h2>Consultations (' . count($consultations) . ')</h2>
        <table><thead><tr><th>Date</th><th>Statut</th><th>Durée</th></tr></thead><tbody>' . ($consultHtml ?: '<tr><td colspan="3" style="padding:8px;color:#9CA3AF">Aucune consultation</td></tr>') . '</tbody></table>

        <h2>Documents médicaux (' . count($documents) . ')</h2>
        <table><thead><tr><th>Document</th><th>Type</th><th>Résumé IA</th></tr></thead><tbody>' . ($docsHtml ?: '<tr><td colspan="3" style="padding:8px;color:#9CA3AF">Aucun document</td></tr>') . '</tbody></table>

        <h2>Ordonnances (' . count($ordonnances) . ')</h2>
        <table><thead><tr><th>Numéro</th><th>Date</th><th>Médicaments</th></tr></thead><tbody>' . ($ordHtml ?: '<tr><td colspan="3" style="padding:8px;color:#9CA3AF">Aucune ordonnance</td></tr>') . '</tbody></table>

        <div class="footer">
            <strong>SantéClaire</strong> — Plateforme certifiée HDS — Document confidentiel<br>
            RPPS : ' . htmlspecialchars($user->getNumeroRPPS()) . ' — ' . htmlspecialchars($user->getAdresseCabinet()) . '
        </div>
        </body></html>';

        $options = new Options();
        $options->set('defaultFont', 'DejaVu Sans');
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return new Response($dompdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="CompteRendu_' . $patient->getLastName() . '.pdf"',
            'Access-Control-Allow-Origin' => '*',
        ]);
    }

    #[Route('/medecin/patient/{id}/note', name: 'api_medecin_patient_note', methods: ['POST'])]
    public function saveNote(int $id, Request $request): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof Medecin) {
            return new JsonResponse(['success' => false, 'message' => 'Accès refusé'], 403);
        }

        $patient = $this->em->getRepository(Patient::class)->find($id);
        if (!$patient) return new JsonResponse(['success' => false, 'message' => 'Patient non trouvé'], 404);

        $data = json_decode($request->getContent(), true);
        $noteText = $data['note'] ?? '';
        if (!$noteText) return new JsonResponse(['success' => false, 'message' => 'Note vide'], 400);

        $doc = new DocumentMedical();
        $doc->setNomFichier('note_' . date('Ymd_His') . '.txt');
        $doc->setNomOriginal('Note de consultation — ' . (new \DateTime())->format('d/m/Y H:i'));
        $doc->setType(\App\Enum\TypeDocument::COMPTE_RENDU);
        $doc->setMimeType('text/plain');
        $doc->setTaille(strlen($noteText));
        $doc->setPatient($patient);
        $doc->setCreateurMedecin($user);
        $doc->setEstConfidentiel(false);
        $doc->setEstPartage(true);
        $doc->setResumeIA($noteText);

        $this->em->persist($doc);
        $this->em->flush();

        return new JsonResponse(['success' => true, 'data' => ['id' => $doc->getId()], 'message' => 'Note enregistrée']);
    }
}
