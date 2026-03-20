<?php

namespace App\Controller\Admin;

use App\Entity\Medecin;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\MoneyField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TelephoneField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class MedecinCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Medecin::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Médecin')
            ->setEntityLabelInPlural('Médecins')
            ->setSearchFields(['firstName', 'lastName', 'email', 'numeroRPPS', 'specialite'])
            ->setDefaultSort(['lastName' => 'ASC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield TextField::new('firstName', 'Prénom');
        yield TextField::new('lastName', 'Nom');
        yield EmailField::new('email');
        yield TextField::new('numeroRPPS', 'N° RPPS');
        yield TextField::new('specialite', 'Spécialité');
        yield TextField::new('adresseCabinet', 'Adresse cabinet')->hideOnIndex();
        yield TelephoneField::new('telephoneCabinet', 'Téléphone cabinet');
        yield TextField::new('tarifConsultation', 'Tarif consultation');
        yield BooleanField::new('estValide', 'Validé');
    }
}
