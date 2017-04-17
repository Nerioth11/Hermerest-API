<?php

namespace AppBundle\Controller\centre;

use AppBundle\Entity\Course;
use AppBundle\Entity\Progenitor;
use AppBundle\Entity\Student;
use AppBundle\Facade\CentreFacade;
use AppBundle\Facade\CourseFacade;
use AppBundle\Facade\ProgenitorFacade;
use AppBundle\Facade\StudentFacade;
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

        if ($centre->containsClassNamedBy($className))
            return new JsonResponse([
                'added' => false,
                'error' => "Ya existe una clase con con este nombre."
            ]);

        $newClass = new Course($className, $centre);
        $courseFacade->create($newClass);

        return new JsonResponse([
            'added' => true,
            'addedClassId' => $newClass->getId(),
            'addedClassName' => $newClass->getName()
        ]);
    }

    /**
     * @Route("/centre/classes/autoimportClass", name="autoimport_class")
     * @Method("POST")
     */
    public function autoimportClassAction(Request $request)
    {
        $courseFacade = new CourseFacade($this->getDoctrine()->getManager());
        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());
        $parentFacade = new ProgenitorFacade($this->getDoctrine()->getManager());
        $className = $request->request->get('className');
        $centre = $this->get('security.token_storage')->getToken()->getUser()->getCentre();
        $students = $request->request->get('students');
        array_pop($students);

        if ($centre->containsClassNamedBy($className))
            return new JsonResponse([
                'added' => false,
                'error' => "Ya existe una clase con nombre: " . $className
            ]);

        $class = new Course($className, $centre);
        $courseFacade->create($class);

        $this->autoimportStudentsToClass($students, $class, $centre, $studentFacade, $courseFacade, $parentFacade);

        return new JsonResponse([
            'imported' => true,
            'addedClassId' => $class->getId(),
            'addedClassName' => $class->getName(),
            'addedClassStudents' => count($class->getStudents()),
        ]);
    }

    private function autoimportStudentsToClass($students, $class, $centre, $studentFacade, $courseFacade, $parentFacade)
    {
        foreach ($students as $student) {
            $studentFields = explode(',', $student);
            $studentName = $studentFields[0];
            $studentSurname = $studentFields[1];

            $student = new Student($studentName, $studentSurname, $class, $centre);
            $studentFacade->create($student);
            $class->addStudent($student);
            $courseFacade->edit();

            array_shift($studentFields);
            array_shift($studentFields);
            $this->autoimportParentsToStudent($studentFacade, $parentFacade, $studentFields, $student);
        }
    }

    private function autoimportParentsToStudent($studentFacade, $parentFacade, $studentFields, $student)
    {
        foreach ($studentFields as $parentTelephone) {
            $parent = $parentFacade->findByTelephone($parentTelephone);
            if ($parent == null) continue;
            $student->addParent($parent);
            $studentFacade->edit();
        }
    }

}
