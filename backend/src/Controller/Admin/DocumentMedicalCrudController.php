<?php

namespace App\Controller\Admin;

use App\Entity\DocumentMedical;
use App\Enum\TypeDocument;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IntegerField;
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
            ->setDefaultSort(['id' => 'DESC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield AssociationField::new('patient');
        yield TextField::new('nomFichier', 'Nom du fichier');
        yield TextField::new('nomOriginal', 'Nom original')->hideOnIndex();
        yield ChoiceField::new('type', 'Type')
            ->setChoices([
                'Ordonnance' => TypeDocument::ORDONNANCE,
                'Analyse' => TypeDocument::ANALYSE,
                'Radiographie' => TypeDocument::RADIOGRAPHIE,
                'Compte-rendu' => TypeDocument::COMPTE_RENDU,
                'Certificat' => TypeDocument::CERTIFICAT,
                'Autre' => TypeDocument::AUTRE,
            ]);
        yield TextField::new('mimeType', 'Type MIME')->hideOnIndex();
        yield IntegerField::new('taille', 'Taille (octets)')->hideOnIndex();
        yield BooleanField::new('estConfidentiel', 'Confidentiel');
        yield BooleanField::new('estPartage', 'Partagé');
    }
}
