<?php

namespace App\Controller\Admin;

use App\Entity\Dossier;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;

class DossierCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Dossier::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Dossier médical')
            ->setEntityLabelInPlural('Dossiers médicaux')
            ->setDefaultSort(['dateCreation' => 'DESC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield AssociationField::new('patient');
        yield DateTimeField::new('dateCreation', 'Date de création');
        yield DateTimeField::new('dateDerniereModification', 'Dernière modification');
        yield TextareaField::new('antecedentsMedicaux', 'Antécédents médicaux')->hideOnIndex();
        yield TextareaField::new('allergies')->hideOnIndex();
    }
}
