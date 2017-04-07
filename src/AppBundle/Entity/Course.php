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
     * @return Course
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
     * Set centre
     *
     * @param \AppBundle\Entity\Centre $centre
     *
     * @return Course
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
     * Add student
     *
     * @param \AppBundle\Entity\Student $student
     *
     * @return Course
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
