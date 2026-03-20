<?php

namespace App\Controller\Admin;

use App\Entity\Ordonnance;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;

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
            ->setDefaultSort(['dateCreation' => 'DESC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield AssociationField::new('consultation');
        yield DateField::new('dateCreation', 'Date de création');
        yield DateField::new('dateExpiration', 'Date d\'expiration');
        yield BooleanField::new('estRenouvellable', 'Renouvelable');
        yield TextareaField::new('instructionsSpeciales', 'Instructions')->hideOnIndex();
    }
}
