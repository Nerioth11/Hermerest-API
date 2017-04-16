<?php
/**
 * Created by PhpStorm.
 * User: alour
 * Date: 13/04/2017
 * Time: 21:08
 */

namespace AppBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="pollOption")
 */
class PollOption
{
    /**
     * @ORM\Column(type="integer", name="id")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, name="text", nullable=false)
     */
    private $text;

    /**
     * @ORM\ManyToOne(targetEntity="Poll")
     * @ORM\JoinColumn(name="poll", referencedColumnName="id", nullable=false, onDelete="cascade")
     */
    private $poll;

    /**
     * @ORM\ManyToMany(targetEntity="Progenitor")
     * @ORM\JoinTable(name="pollReply",
     *      joinColumns={@ORM\JoinColumn(name="pollOption", referencedColumnName="id", onDelete="cascade")},
     *      inverseJoinColumns={@ORM\JoinColumn(name="parent", referencedColumnName="id", onDelete="cascade")}
     *      )
     */
    private $parents;

    public function __construct()
    {
        $this->parents = new ArrayCollection();
    }
}