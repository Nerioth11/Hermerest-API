<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="centre")
 */
class Centre
{
    /**
     * @ORM\Column(type="integer", name="id")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=50, name="name", nullable=false)
     */
    private $name;

    /**
     * @ORM\OneToMany(targetEntity="Course", mappedBy="centre")
     */
    private $classes;

    /**
     * @ORM\OneToMany(targetEntity="Student", mappedBy="centre")
     */
    private $students;

    public function __construct()
    {
        $this->classes = new ArrayCollection();
        $this->students = new ArrayCollection();
    }
}