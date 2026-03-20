<?php

namespace App\Controller\Admin;

use App\Entity\ConsultationSession;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\AssociationField;
use EasyCorp\Bundle\EasyAdminBundle\Field\DateTimeField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextareaField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class ConsultationSessionCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return ConsultationSession::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Consultation')
            ->setEntityLabelInPlural('Consultations')
            ->setDefaultSort(['dateConsultation' => 'DESC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield AssociationField::new('patient');
        yield AssociationField::new('medecin', 'Médecin');
        yield DateTimeField::new('dateConsultation', 'Date');
        yield TextField::new('motif');
        yield TextareaField::new('notes')->hideOnIndex();
        yield TextareaField::new('diagnostic')->hideOnIndex();
    }
}
