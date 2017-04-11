<?php
/**
 * Created by PhpStorm.
 * User: alour
 * Date: 09/04/2017
 * Time: 13:13
 */

namespace AppBundle\Facade;


use Doctrine\ORM\EntityManager;

class ProgenitorFacade extends AbstractFacade
{
    public function __construct(EntityManager $entityManager)
    {
        parent::__construct($entityManager, 'AppBundle:Progenitor');
    }

    public function findByTelephone($telephone)
    {
        return $this->entityManager->getRepository($this->entityName)->findOneBy(
            array('telephone' => '' . $telephone)
        );
    }
}