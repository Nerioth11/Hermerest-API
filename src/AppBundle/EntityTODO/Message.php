<?php
/**
 * Created by PhpStorm.
 * User: alour
 * Date: 13/04/2017
 * Time: 21:08
 */

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="message")
 * @ORM\InheritanceType("JOINED")
 * @ORM\DiscriminatorColumn(name="type", type="string")
 * @ORM\DiscriminatorMap({"authorization" = "Authorization", "circular" = "Circular", "poll" = "Poll"})
 */
abstract class Message
{
    /**
     * @ORM\Column(type="integer", name="id")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, name="subject", nullable=false)
     */
    private $subject;

    /**
     * @ORM\Column(type="text", length=65535, name="message", nullable=false)
     */
    private $message;

    /**
     * @ORM\Column(type="datetimetz", name="sendingDate", nullable=false)
     */
    private $sendingDate;

    /**
     * @ORM\ManyToOne(targetEntity="Centre")
     * @ORM\JoinColumn(name="sender", referencedColumnName="id", nullable=false, onDelete="cascade")
     */
    private $sender;
}