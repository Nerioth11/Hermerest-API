<?php

namespace AppBundle\Controller\centre;

use AppBundle\Entity\Progenitor;
use AppBundle\Facade\CourseFacade;
use AppBundle\Facade\ProgenitorFacade;
use AppBundle\Facade\StudentFacade;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
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
                'student' => $studentFacade->find($studentId)
            ]);
    }

    /**
     * @Route("/centre/student/delete", name="delete_student")
     * @Method("POST")
     */
    public function deleteStudentAction(Request $request)
    {
        $studentId = $request->request->get('studentId');

        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());
        $student = $studentFacade->find($studentId);

        $studentFacade->remove($student);

        return new JsonResponse([
            'deleted' => true,
            'deletedStudentId' => $student->getId(),
        ]);
    }

    /**
     * @Route("/centre/student/edit", name="edit_student")
     * @Method("POST")
     */
    public function editStudentAction(Request $request)
    {
        $studentId = $request->request->get('studentId');
        $studentName = $request->request->get('studentName');
        $studentSurname = $request->request->get('studentSurname');
        $studentClassId = $request->request->get('studentClass');

        $courseFacade = new CourseFacade($this->getDoctrine()->getManager());
        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());

        $class = $courseFacade->find($studentClassId);
        $student = $studentFacade->find($studentId);

        $student->setName($studentName);
        $student->setSurname($studentSurname);
        $student->setClass($class);

        $studentFacade->edit();

        return new JsonResponse([
            'edited' => true,
            'studentName' => $student->getName(),
            'studentSurname' => $student->getSurname(),
            'studentClass' => $student->getClass()->getName(),
        ]);
    }

    /**
     * @Route("/centre/student/deleteParent", name="delete_parent")
     * @Method("POST")
     */
    public function deleteParentAction(Request $request)
    {
        $studentId = $request->request->get('studentId');
        $parentId = $request->request->get('parentId');

        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());
        $progenitorFacade = new ProgenitorFacade($this->getDoctrine()->getManager());

        $student = $studentFacade->find($studentId);
        $parent = $progenitorFacade->find($parentId);

        $student->removeParent($parent);
        $studentFacade->edit();

        return new JsonResponse([
            'deleted' => true,
            'deletedParentId' => $parentId,
        ]);
    }
}
