<?php

namespace AppBundle\Controller\messaging;

use AppBundle\Entity\Authorization;
use AppBundle\Facade\AuthorizationFacade;
use AppBundle\Facade\StudentFacade;
use AppBundle\Utils\AttachmentManager;
use DateTime;
use DateTimeZone;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class AuthorizationsController extends Controller
{
    /**
     * @Route("/messaging/authorizations", name="authorizations")
     */
    public function authorizationssAction()
    {
        return $this->render('/messaging/authorizations.html.twig');
    }

    /**
     * @Route("/messaging/authorizations/sendAuthorization", name="send_authorization")
     * @Method("POST")
     */
    public function sendAuthorizationAction(Request $request)
    {
        $authorizationFacade = new AuthorizationFacade($this->getDoctrine()->getManager());

        $centre = $this->get('security.token_storage')->getToken()->getUser()->getCentre();
        $subject = $request->request->get('subject');
        $limitDate = date_create_from_format('Y-m-d G:i:s', $request->request->get('limitDate') . " 23:59:59", new DateTimeZone('UTC'));
        $message = $request->request->get('message');
        $fileName = $request->request->get('fileName');
        $fileContent = $request->request->get('fileContent');
        $sendingDate = new DateTime();
        date_timezone_set($sendingDate, timezone_open('Atlantic/Canary'));

        $authorization = new Authorization($subject, $message, $sendingDate, $centre, $limitDate);
        $authorizationFacade->create($authorization);

        if ($fileName != null) AttachmentManager::attachFileToMessage($fileName, $fileContent, $authorization, $this->getDoctrine()->getManager());

        $this->sendAuthorization($request->request->get('studentsIds'), $authorization, $authorizationFacade);

        return new JsonResponse([
            'sent' => true,
            'sentAuthorizationId' => $authorization->getId(),
            'sentAuthorizationLimitDate' => $authorization->getLimitDate(),
            'sentAuthorizationSubject' => $authorization->getSubject(),
        ]);
    }

    /**
     * @Route("/messaging/authorizations/getAuthorization", name="get_authorization")
     * @Method("GET")
     */
    public function getAuthorizationAction(Request $request)
    {
        $authorizationFacade = new AuthorizationFacade($this->getDoctrine()->getManager());
        $authorizationId = $request->query->get('id');
        $authorization = $authorizationFacade->find($authorizationId);
        $authorizationAttachment = count($authorization->getAttachments()) == 0 ? null : $authorization->getAttachments()[0];

        $students = array();
        foreach ($authorization->getStudents() as $student)
            array_push($students,
                [
                    $student->getSurname() . ", " . $student->getName(),
                    $student->isAuthorizedTo($authorization) ? 1 : 0
                ]);

        return new JSonResponse([
            'found' => true,
            'authorizationSubject' => $authorization->getSubject(),
            'authorizationMessage' => $authorization->getMessage(),
            'authorizationSendingDate' => $authorization->getSendingDate(),
            'authorizationLimitDate' => $authorization->getLimitDate(),
            'students' => $students,
            'authorizationAttachmentId' => $authorizationAttachment == null ? null : $authorizationAttachment->getId(),
            'authorizationAttachmentName' => $authorizationAttachment == null ? null : $authorizationAttachment->getName()
        ]);
    }

    private function sendAuthorization($studentsIds, $authorization, $authorizationFacade)
    {
        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());
        foreach ($studentsIds as $studentId) {
            $authorization->addStudent($studentFacade->find($studentId));
            $authorizationFacade->edit();
        }
    }
}
