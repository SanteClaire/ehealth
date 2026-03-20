<?php

namespace App\Controller\Admin;

use App\Entity\Medicament;
use App\Enum\FormatMedicament;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\BooleanField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class MedicamentCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Medicament::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Médicament')
            ->setEntityLabelInPlural('Médicaments')
            ->setSearchFields(['nomCommercial', 'nomMolecule', 'codeATC'])
            ->setDefaultSort(['nomCommercial' => 'ASC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield TextField::new('nomCommercial', 'Nom commercial');
        yield TextField::new('nomMolecule', 'Molécule');
        yield TextField::new('dosage');
        yield ChoiceField::new('forme', 'Forme')
            ->setChoices([
                'Comprimé' => FormatMedicament::COMPRIME,
                'Gélule' => FormatMedicament::GELULE,
                'Sirop' => FormatMedicament::SIROP,
                'Injectable' => FormatMedicament::INJECTABLE,
                'Crème' => FormatMedicament::CREME,
                'Suppositoire' => FormatMedicament::SUPPOSITOIRE,
            ]);
        yield TextField::new('codeATC', 'Code ATC');
        yield BooleanField::new('estGenerique', 'Générique');
    }
}
