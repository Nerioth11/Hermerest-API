<?php

namespace AppBundle\Controller\centre;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class TeachersController extends Controller
{
    /**
     * @Route("/centre/teachers", name="teachers")
     */
    public function teachersAction()
    {
        return $this->render('/centre/teachers.html.twig');
    }
}
