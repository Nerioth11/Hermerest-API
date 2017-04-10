<?php

namespace AppBundle\Controller\centre;

use AppBundle\Entity\Course;
use AppBundle\Facade\CentreFacade;
use AppBundle\Facade\CourseFacade;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
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

    /**
     * @Route("/centre/classes/add", name="add_class")
     * @Method("POST")
     */
    public function addClassAction(Request $request)
    {
        $courseFacade = new CourseFacade($this->getDoctrine()->getManager());
        $centreFacade = new CentreFacade($this->getDoctrine()->getManager());

        $className = $request->request->get('className');
        $centreId = $request->request->get('centreId');
        $centre = $centreFacade->find($centreId);

        if($centre->containsClassNamedBy($className))
            return new JsonResponse([
                'added' => false,
                'error' => "Ya existe una clase con con este nombre."
            ]);

        $newClass = new Course();
        $newClass->setCentre($centre);
        $newClass->setName($className);
        $courseFacade->create($newClass);

        return new JsonResponse([
            'added' => true,
            'addedClassId' => $newClass->getId(),
            'addedClassName' => $newClass->getName()
        ]);
    }

}
