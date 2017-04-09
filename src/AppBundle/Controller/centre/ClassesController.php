<?php

namespace AppBundle\Controller\centre;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class ClassesController extends Controller
{
    /**
     * @Route("/centre/classes", name="classes")
     */
    public function classesAction()
    {
        return $this->render('/centre/classes.html.twig',
            [
                'classes' => $this->getUser()->getCentre()->getClasses()
            ]);
    }
}
