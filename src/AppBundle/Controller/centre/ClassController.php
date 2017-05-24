<?php

namespace AppBundle\Controller\centre;

use AppBundle\Facade\CourseFacade;
use AppBundle\Facade\StudentFacade;
use AppBundle\Utils\ResponseFactory;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class ClassController extends Controller
{
    /**
     * @Route("/centre/classes/{id}", name="class")
     */
    public function classAction(Request $request, $id)
    {
        return $this->render('/centre/class.html.twig', [
            'class' => (new CourseFacade($this->getDoctrine()->getManager()))->find($id)
        ]);
    }

    /**
     * @Route("/classes/{id}", name="edit_class")
     * @Method("PATCH")
     */
    public function editClassAction(Request $request, $id)
    {
        $className = $request->request->get('className');
        $courseFacade = new CourseFacade($this->getDoctrine()->getManager());
        $class = $courseFacade->find($id);

        if ($this->classNameAlreadyExists($class, $className))
            return ResponseFactory::createJsonResponse(false, "Ya existe una clase con nombre: " . $className);

        $class->setName($className);
        $courseFacade->edit();

        return ResponseFactory::createJsonResponse(true, ['name' => $class->getName()]);
    }

    /**
     * @Route("/classes/{classId}/students/{studentId}", name="delete_student_from_class")
     * @Method("DELETE")
     */
    public function deleteStudentAction(Request $request, $classId, $studentId)
    {
        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());
        $student = $studentFacade->find($studentId);
        $student->setClass(null);
        $studentFacade->edit();
        return ResponseFactory::createJsonResponse(true, [
            'id' => $student->getId(),
            'name' => $student->getName(),
            'surname' => $student->getSurname(),
        ]);
    }

    /**
     * @Route("/classes/{classId}/students/{studentId}", name="add_student_to_class")
     * @Method("POST")
     */
    public function addStudentAction(Request $request, $classId, $studentId)
    {
        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());
        $student = $studentFacade->find($studentId);
        $student->setClass((new CourseFacade($this->getDoctrine()->getManager()))->find($classId));
        $studentFacade->edit();

        return ResponseFactory::createJsonResponse(true, [
            'id' => $student->getId(),
            'name' => $student->getName(),
            'surname' => $student->getSurname(),
            'oldClassName' => $student->getClass() == null ? null : $student->getClass()->getName(),
        ]);
    }

    /**
     * @Route("/classes/{id}", name="delete_class")
     * @Method("DELETE")
     */
    public function deleteClassAction(Request $request, $id)
    {
        $courseFacade = new CourseFacade($this->getDoctrine()->getManager());
        $courseFacade->remove($courseFacade->find($id));
        return ResponseFactory::createJsonResponse(true, []);
    }

    private function classNameAlreadyExists($class, $className)
    {
        return $class->getCentre()->containsClassNamedBy($className) && ($className != $class->getName());
    }

}
