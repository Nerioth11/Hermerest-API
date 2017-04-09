<?php

namespace AppBundle\Controller\centre;

use AppBundle\Facade\StudentFacade;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class StudentController extends Controller
{
    /**
     * @Route("/centre/student", name="student")
     */
    public function studentAction(Request $request)
    {
        $studentId = $request->query->get('id');
        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());

        return $this->render('/centre/student.html.twig',
            [
                'student' =>$studentFacade->find($studentId)
            ]);
    }
}
