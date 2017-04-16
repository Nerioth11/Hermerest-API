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
 * @ORM\Table(name="poll")
 */
class Poll extends Message
{
    /**
     * @ORM\Column(type="datetimetz", name="limitDate", nullable=false)
     */
    private $limitDate;

    /**
     * @ORM\Column(type="boolean", name="multipleChoice", nullable=false)
     */
    private $multipleChoice;
}