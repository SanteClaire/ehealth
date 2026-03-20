<?php

namespace App\Controller\Admin;

use App\Entity\DocumentMedical;
use App\Enum\TypeDocument;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class DocumentMedicalCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return DocumentMedical::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Document médical')
            ->setEntityLabelInPlural('Documents médicaux')
            ->setDefaultSort(['dateUpload' => 'DESC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield AssociationField::new('dossier');
        yield TextField::new('nomFichier', 'Nom du fichier');
        yield ChoiceField::new('typeDocument', 'Type')
            ->setChoices([
                'Ordonnance' => TypeDocument::ORDONNANCE,
                'Analyse' => TypeDocument::ANALYSE,
                'Radiologie' => TypeDocument::RADIOLOGIE,
                'Compte-rendu' => TypeDocument::COMPTE_RENDU,
                'Certificat' => TypeDocument::CERTIFICAT,
                'Autre' => TypeDocument::AUTRE,
            ]);
        yield DateTimeField::new('dateUpload', 'Date d\'upload');
        yield TextareaField::new('description')->hideOnIndex();
    }
}
