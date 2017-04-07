<?php

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="class", uniqueConstraints={
 * @ORM\UniqueConstraint(columns={"name", "centre"})
 * })
 */
class Course
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
     * @ORM\ManyToOne(targetEntity="Centre", inversedBy="classes")
     * @ORM\JoinColumn(name="centre", referencedColumnName="id", nullable=false, onDelete="cascade")
     */
    private $centre;

    /**
     * @ORM\OneToMany(targetEntity="Student", mappedBy="class")
     */
    private $students;


    public function __construct()
    {
        $this->students = new ArrayCollection();
    }
}