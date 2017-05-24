<?php

namespace AppBundle\Controller\centre;

use AppBundle\Facade\CourseFacade;
use AppBundle\Facade\ProgenitorFacade;
use AppBundle\Facade\StudentFacade;
use AppBundle\Utils\ResponseFactory;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class StudentController extends Controller
{
    /**
     * @Route("/centre/students/{id}", name="student")
     */
    public function studentAction(Request $request, $id)
    {
        return $this->render('/centre/student.html.twig', ['student' => (new StudentFacade($this->getDoctrine()->getManager()))->find($id)]);
    }

    /**
     * @Route("/students/{id}", name="delete_student")
     * @Method("DELETE")
     */
    public function deleteStudentAction(Request $request, $id)
    {
        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());
        $studentFacade->remove($studentFacade->find($id));
        return ResponseFactory::createJsonResponse(true, []);
    }

    /**
     * @Route("/students/{id}", name="edit_student")
     * @Method("PATCH")
     */
    public function editStudentAction(Request $request, $id)
    {
        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());
        $student = $studentFacade->find($id);
        $this->setStudentFields($request, $student);
        $studentFacade->edit();
        return ResponseFactory::createJsonResponse(true, [
            'name' => $student->getName(),
            'surname' => $student->getSurname(),
            'class' => $student->getClass()->getName(),
        ]);
    }

    /**
     * @Route("/students/{studentId}/parents/{parentId}", name="delete_parent")
     * @Method("DELETE")
     */
    public function deleteParentAction(Request $request, $studentId, $parentId)
    {
        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());
        $studentFacade->find($studentId)->removeParent((new ProgenitorFacade($this->getDoctrine()->getManager()))->find($parentId));
        $studentFacade->edit();
        return ResponseFactory::createJsonResponse(true, ['id' => $parentId]);
    }

    private function setStudentFields(Request $request, $student)
    {
        $student->setName($request->request->get('studentName'));
        $student->setSurname($request->request->get('studentSurname'));
        $student->setClass((new CourseFacade($this->getDoctrine()->getManager()))->find($request->request->get('studentClass')));
    }
}
