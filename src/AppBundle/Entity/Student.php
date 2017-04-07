<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="student")
 */
class Student
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
     * @ORM\Column(type="string", length=50, name="surname", nullable=false)
     */
    private $surname;

    /**
     * @ORM\ManyToOne(targetEntity="Course", inversedBy="students")
     * @ORM\JoinColumn(name="class", referencedColumnName="id", onDelete="set null")
     */
    private $class;

    /**
     * @ORM\ManyToOne(targetEntity="Centre", inversedBy="students")
     * @ORM\JoinColumn(name="centre", referencedColumnName="id", nullable=false, onDelete="cascade")
     */
    private $centre;

    /**
     * @ORM\ManyToMany(targetEntity="Progenitor", inversedBy="children")
     * @ORM\JoinTable(name="student_parent",
     *      joinColumns={@ORM\JoinColumn(name="student", referencedColumnName="id", onDelete="cascade")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="parent", referencedColumnName="id", onDelete="cascade")}
     *      )
     */
    private $parents;

    public function __construct()
    {
        $this->parents = new ArrayCollection();
    }

}