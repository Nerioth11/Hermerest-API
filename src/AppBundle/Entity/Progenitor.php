<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="parent")
 */
class Progenitor
{
    /**
     * @ORM\Column(type="integer", name="id")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50, name="nif", nullable=false, unique=true)
     */
    private $nif;

    /**
     * @ORM\Column(type="string", length=50, name="name", nullable=false)
     */
    private $name;

    /**
     * @ORM\Column(type="string", length=50, name="telephone", nullable=false, unique=true)
     */
    private $telephone;

    /**
     * @ORM\ManyToMany(targetEntity="Student", mappedBy="parents")
     */
    private $children;

    public function __construct()
    {
        $this->children = new ArrayCollection();
    }
}