<?php

namespace App\Controller\Admin;

use App\Entity\Admin;
use App\Enum\NiveauAdmin;
use EasyCorp\Bundle\EasyAdminBundle\Config\Crud;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractCrudController;
use EasyCorp\Bundle\EasyAdminBundle\Field\ArrayField;
use EasyCorp\Bundle\EasyAdminBundle\Field\ChoiceField;
use EasyCorp\Bundle\EasyAdminBundle\Field\EmailField;
use EasyCorp\Bundle\EasyAdminBundle\Field\IdField;
use EasyCorp\Bundle\EasyAdminBundle\Field\TextField;

class AdminCrudController extends AbstractCrudController
{
    public static function getEntityFqcn(): string
    {
        return Admin::class;
    }

    public function configureCrud(Crud $crud): Crud
    {
        return $crud
            ->setEntityLabelInSingular('Administrateur')
            ->setEntityLabelInPlural('Administrateurs')
            ->setSearchFields(['firstName', 'lastName', 'email'])
            ->setDefaultSort(['lastName' => 'ASC']);
    }

    public function configureFields(string $pageName): iterable
    {
        yield IdField::new('id')->hideOnForm();
        yield TextField::new('firstName', 'Prénom');
        yield TextField::new('lastName', 'Nom');
        yield EmailField::new('email');
        yield ChoiceField::new('niveau', 'Niveau')
            ->setChoices([
                'Admin' => NiveauAdmin::ADMIN,
                'Super Admin' => NiveauAdmin::SUPER_ADMIN,
                'Modérateur' => NiveauAdmin::MODERATEUR,
            ]);
        yield ArrayField::new('permissions')->hideOnIndex();
        yield ArrayField::new('ipAutorisees', 'IPs autorisées')->hideOnIndex();
    }
}
