<?php

namespace AppBundle\Controller\messaging;

use AppBundle\Entity\Authorization;
use AppBundle\Facade\AuthorizationFacade;
use AppBundle\Facade\StudentFacade;
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
        $limitDate = date_create_from_format('Y-m-d G:i:s',$request->request->get('limitDate') . " 23:59:59", new DateTimeZone('UTC'));
        $message = $request->request->get('message');
        $sendingDate = new DateTime();

        $authorization = new Authorization($subject, $message, $sendingDate, $centre, $limitDate);
        $authorizationFacade->create($authorization);

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

        return new JSonResponse([
            'found' => true,
            'authorizationSubject' => $authorization->getSubject(),
            'authorizationMessage' => $authorization->getMessage(),
            'authorizationSendingDate' => $authorization->getSendingDate(),
            'authorizationLimitDate' => $authorization->getLimitDate(),
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
