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
 * @ORM\Table(name="authorization")
 */
class Authorization extends Message
{

    /**
     * @ORM\Column(type="datetimetz", name="limitDate", nullable=false)
     */
    private $limitDate;
}