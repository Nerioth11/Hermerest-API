<?php

namespace AppBundle\Controller\centre;

use AppBundle\Entity\Student;
use AppBundle\Facade\CourseFacade;
use AppBundle\Facade\ProgenitorFacade;
use AppBundle\Facade\StudentFacade;
use AppBundle\Utils\ResponseFactory;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class StudentsController extends Controller
{
    /**
     * @Route("/centre/students", name="students")
     */
    public function studentsAction()
    {
        return $this->render('/centre/students.html.twig');
    }

    /**
     * @Route("/students", name="register_student")
     * @Method("POST")
     */
    public function registerStudentAction(Request $request)
    {
        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());
        $courseFacade = new CourseFacade($this->getDoctrine()->getManager());
        $class = $courseFacade->find($request->request->get('studentClass'));
        $student = new Student(
            $request->request->get('studentName'),
            $request->request->get('studentSurname'),
            $class,
            $class->getCentre()
        );
        $studentFacade->create($student);

        return ResponseFactory::createJsonResponse(true, [
            'id' => $student->getId(),
            'class' => $student->getClass()->getName(),
            'name' => $student->getName(),
            'surname' => $student->getSurname(),
        ]);
    }

    /**
     * @Route("/students/{studentId}/parents/{parentTelephone}", name="add_parent")
     * @Method("POST")
     */
    public function addParentAction(Request $request, $studentId, $parentTelephone)
    {
        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());
        $student = $studentFacade->find($studentId);
        $parent = (new ProgenitorFacade($this->getDoctrine()->getManager()))->findByTelephone($parentTelephone);
        $student->addParent($parent);
        $studentFacade->edit();

        return ResponseFactory::createJsonResponse(true, [
            'id' => $parent->getId(),
            'telephone' => $parent->getTelephone(),
            'fullname' => $parent->getName(),
            'studentId' => $student->getId(),
        ]);
    }
}
