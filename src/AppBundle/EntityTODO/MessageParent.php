<?php
/**
 * Created by PhpStorm.
 * User: alour
 * Date: 14/04/2017
 * Time: 0:06
 */

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="message_parent")
 */
class MessageParent
{
    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Message")
     * @ORM\JoinColumn(name="message", referencedColumnName="id", nullable=false, onDelete="cascade")
     */
    private $message;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Progenitor")
     * @ORM\JoinColumn(name="parent", referencedColumnName="id", nullable=false, onDelete="cascade")
     */
    private $parent;

    /**
     * @ORM\Column(type="boolean", name="read", nullable=false, options={"default":false})
     */
    private $read;
}