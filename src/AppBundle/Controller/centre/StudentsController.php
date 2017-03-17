<?php

namespace AppBundle\Controller\centre;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class StudentsController extends Controller
{
    /**
     * @Route("/centre/students", name="students")
     */
    public function studentsAction()
    {
        return $this->render('/centre/students.html.twig');
    }
}
