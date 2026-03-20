<?php

namespace App\Controller\Admin;

use App\Entity\Patient;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Config\Filters;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TelephoneField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;
use EasyCorp\Bundle\EasyAdminBundle\Filter\TextFilter;

class PatientCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Patient::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Patient')
            ->setEntityLabelInPlural('Patients')
            ->setSearchFields(['firstName', 'lastName', 'email', 'numeroSecuriteSociale'])
            ->setDefaultSort(['lastName' => 'ASC']);
    }

    public function configureFilters(Filters $filters): Filters
    {
        return $filters
            ->add(TextFilter::new('lastName'))
            ->add(TextFilter::new('groupeSanguin'));
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield TextField::new('firstName', 'Prénom');
        yield TextField::new('lastName', 'Nom');
        yield EmailField::new('email');
        yield TextField::new('numeroSecuriteSociale', 'N° Sécu')->hideOnIndex();
        yield DateField::new('dateNaissance', 'Date de naissance');
        yield TextField::new('adresse')->hideOnIndex();
        yield TelephoneField::new('telephone', 'Téléphone');
        yield TextField::new('groupeSanguin', 'Groupe sanguin');
    }
}
