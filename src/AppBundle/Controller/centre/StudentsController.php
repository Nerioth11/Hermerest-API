<?php

namespace AppBundle\Controller\centre;

use AppBundle\Entity\Progenitor;
use AppBundle\Entity\Student;
use AppBundle\Facade\CourseFacade;
use AppBundle\Facade\ProgenitorFacade;
use AppBundle\Facade\StudentFacade;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
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
     * @Route("/centre/students/findParent", name="find_parent")
     * @Method("GET")
     */
    public function findParentAction(Request $request)
    {
        $parentTelephone = $request->query->get('parentTelephone');

        $progenitorFacade = new ProgenitorFacade($this->getDoctrine()->getManager());

        $parent = $progenitorFacade->findByTelephone($parentTelephone);

        if ($parent == null) return new JsonResponse(['found' => false]);

        return new JsonResponse([
            'found' => true,
            'parentId' => $parent->getId(),
            'parentTelephone' => $parent->getTelephone(),
            'parentFullname' => $parent->getName(),
        ]);
    }

    /**
     * @Route("/centre/students/register", name="register_student")
     * @Method("POST")
     */
    public function registerStudentAction(Request $request)
    {
        $studentName = $request->request->get('studentName');
        $studentSurname = $request->request->get('studentSurname');
        $studentClass = $request->request->get('studentClass');

        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());
        $courseFacade = new CourseFacade($this->getDoctrine()->getManager());
        $class= $courseFacade->find($studentClass);

        $student = new Student();
        $student->setCentre($class->getCentre());
        $student->setClass($class);
        $student->setName($studentName);
        $student->setSurname($studentSurname);

        $studentFacade->create($student);

        return new JsonResponse([
            'registered' => true,
            'studentId' => $student->getId(),
            'studentClass' => $student->getClass()->getName(),
            'studentName' => $student->getName(),
            'studentSurname' => $student->getSurname(),
        ]);
    }
}
