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
 * @ORM\Table(name="authorizationReply")
 */
class AuthorizationReply
{
    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Authorization")
     * @ORM\JoinColumn(name="authorization", referencedColumnName="id", nullable=false, onDelete="cascade")
     */
    private $authorization;

    /**
     * @ORM\Id
     * @ORM\ManyToOne(targetEntity="Progenitor")
     * @ORM\JoinColumn(name="parent", referencedColumnName="id", nullable=false, onDelete="cascade")
     */
    private $parent;

    /**
     * @ORM\Column(type="boolean", name="authorized", nullable=false, options={"default":false})
     */
    private $authorized;
}