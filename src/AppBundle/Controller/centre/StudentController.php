<?php

namespace AppBundle\Controller\centre;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class StudentController extends Controller
{
    /**
     * @Route("/centre/student", name="student")
     */
    public function studentAction()
    {
        return $this->render('/centre/student.html.twig');
    }
}
