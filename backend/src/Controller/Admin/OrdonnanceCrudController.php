<?php

namespace App\Controller\Admin;

use App\Entity\Ordonnance;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class OrdonnanceCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Ordonnance::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Ordonnance')
            ->setEntityLabelInPlural('Ordonnances')
            ->setDefaultSort(['dateEmission' => 'DESC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield TextField::new('numero', 'Numéro');
        yield AssociationField::new('patient');
        yield AssociationField::new('medecin', 'Médecin');
        yield DateField::new('dateEmission', 'Date d\'émission')->hideOnForm();
        yield DateField::new('dateExpiration', 'Date d\'expiration');
        yield TextareaField::new('instructions', 'Instructions')->hideOnIndex();
    }
}
