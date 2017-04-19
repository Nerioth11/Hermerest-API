<?php
/**
 * Created by PhpStorm.
 * User: alour
 * Date: 13/04/2017
 * Time: 21:08
 */

namespace AppBundle\Entity;

use DateTime;
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

    public function __construct($subject = null, $message = null, ?DateTime $sendingDate = null, ?Centre $centre = null, $limitDate = null)
    {
        $this->limitDate = $limitDate;
        parent::__construct($subject, $message, $sendingDate, $centre);
    }

    /**
     * Set limitDate
     *
     * @param \DateTime $limitDate
     *
     * @return Authorization
     */
    public function setLimitDate($limitDate)
    {
        $this->limitDate = $limitDate;

        return $this;
    }

    /**
     * Get limitDate
     *
     * @return \DateTime
     */
    public function getLimitDate()
    {
        return $this->limitDate;
    }
}
