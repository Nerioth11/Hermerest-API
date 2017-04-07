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
     * @return Centre
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
     * Add class
     *
     * @param \AppBundle\Entity\Course $class
     *
     * @return Centre
     */
    public function addClass(\AppBundle\Entity\Course $class)
    {
        $this->classes[] = $class;

        return $this;
    }

    /**
     * Remove class
     *
     * @param \AppBundle\Entity\Course $class
     */
    public function removeClass(\AppBundle\Entity\Course $class)
    {
        $this->classes->removeElement($class);
    }

    /**
     * Get classes
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getClasses()
    {
        return $this->classes;
    }

    /**
     * Add student
     *
     * @param \AppBundle\Entity\Student $student
     *
     * @return Centre
     */
    public function addStudent(\AppBundle\Entity\Student $student)
    {
        $this->students[] = $student;

        return $this;
    }

    /**
     * Remove student
     *
     * @param \AppBundle\Entity\Student $student
     */
    public function removeStudent(\AppBundle\Entity\Student $student)
    {
        $this->students->removeElement($student);
    }

    /**
     * Get students
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getStudents()
    {
        return $this->students;
    }
}
