<?php

namespace AppBundle\Controller\centre;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class ClassController extends Controller
{
    /**
     * @Route("/centre/class", name="class")
     */
    public function classAction()
    {
        return $this->render('/centre/class.html.twig');
    }
}
