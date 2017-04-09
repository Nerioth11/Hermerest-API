<?php

namespace AppBundle\Controller\centre;

use AppBundle\Facade\CourseFacade;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class ClassController extends Controller
{
    /**
     * @Route("/centre/class", name="class")
     */
    public function classAction(Request $request)
    {
        $classId = $request->query->get('id');
        $courseFacade = new CourseFacade($this->getDoctrine()->getManager(), 'AppBundle:Course');

        return $this->render('/centre/class.html.twig',
            [
                'class' =>$courseFacade->find($classId)
            ]);
    }
}
