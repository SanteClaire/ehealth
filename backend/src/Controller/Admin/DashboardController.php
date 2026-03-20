<?php

namespace App\Controller\Admin;

use App\Entity\Admin;
use App\Entity\ConsultationSession;
use App\Entity\DocumentMedical;
use App\Entity\Dossier;
use App\Entity\Medecin;
use App\Entity\Medicament;
use App\Entity\Ordonnance;
use App\Entity\Patient;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use EasyCorp\Bundle\EasyAdminBundle\Router\AdminUrlGenerator;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class DashboardController extends AbstractDashboardController
{
    #[Route('/admin', name: 'admin')]
    #[IsGranted('ROLE_ADMIN')]
    public function index(): Response
    {
        $adminUrlGenerator = $this->container->get(AdminUrlGenerator::class);
        
        // Redirect to Patient list by default
        return $this->redirect($adminUrlGenerator->setController(PatientCrudController::class)->generateUrl());
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('🏥 SantéClaire Admin')
            ->setFaviconPath('favicon.ico')
            ->renderContentMaximized();
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Dashboard', 'fa fa-home');
        
        yield MenuItem::section('Utilisateurs');
        yield MenuItem::linkToCrud('Patients', 'fa fa-user-injured', Patient::class);
        yield MenuItem::linkToCrud('Médecins', 'fa fa-user-md', Medecin::class);
        yield MenuItem::linkToCrud('Administrateurs', 'fa fa-user-shield', Admin::class);
        
        yield MenuItem::section('Médical');
        yield MenuItem::linkToCrud('Consultations', 'fa fa-stethoscope', ConsultationSession::class);
        yield MenuItem::linkToCrud('Ordonnances', 'fa fa-prescription', Ordonnance::class);
        yield MenuItem::linkToCrud('Médicaments', 'fa fa-pills', Medicament::class);
        yield MenuItem::linkToCrud('Documents', 'fa fa-file-medical', DocumentMedical::class);
        yield MenuItem::linkToCrud('Dossiers', 'fa fa-folder-open', Dossier::class);
        
        yield MenuItem::section('');
        yield MenuItem::linkToUrl('↩ Retour au site', 'fa fa-arrow-left', '/');
        yield MenuItem::linkToLogout('Déconnexion', 'fa fa-sign-out-alt');
    }
}
