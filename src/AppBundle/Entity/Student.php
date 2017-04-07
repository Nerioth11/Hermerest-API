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


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Student
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set surname
     *
     * @param string $surname
     *
     * @return Student
     */
    public function setSurname($surname)
    {
        $this->surname = $surname;

        return $this;
    }

    /**
     * Get surname
     *
     * @return string
     */
    public function getSurname()
    {
        return $this->surname;
    }

    /**
     * Set class
     *
     * @param \AppBundle\Entity\Course $class
     *
     * @return Student
     */
    public function setClass(\AppBundle\Entity\Course $class = null)
    {
        $this->class = $class;

        return $this;
    }

    /**
     * Get class
     *
     * @return \AppBundle\Entity\Course
     */
    public function getClass()
    {
        return $this->class;
    }

    /**
     * Set centre
     *
     * @param \AppBundle\Entity\Centre $centre
     *
     * @return Student
     */
    public function setCentre(\AppBundle\Entity\Centre $centre)
    {
        $this->centre = $centre;

        return $this;
    }

    /**
     * Get centre
     *
     * @return \AppBundle\Entity\Centre
     */
    public function getCentre()
    {
        return $this->centre;
    }

    /**
     * Add parent
     *
     * @param \AppBundle\Entity\Progenitor $parent
     *
     * @return Student
     */
    public function addParent(\AppBundle\Entity\Progenitor $parent)
    {
        $this->parents[] = $parent;

        return $this;
    }

    /**
     * Remove parent
     *
     * @param \AppBundle\Entity\Progenitor $parent
     */
    public function removeParent(\AppBundle\Entity\Progenitor $parent)
    {
        $this->parents->removeElement($parent);
    }

    /**
     * Get parents
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getParents()
    {
        return $this->parents;
    }
}
