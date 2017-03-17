<?php

namespace AppBundle\Controller\centre;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class SubjectsController extends Controller
{
    /**
     * @Route("/centre/subjects", name="subjects")
     */
    public function subjectsAction()
    {
        return $this->render('/centre/subjects.html.twig');
    }
}
