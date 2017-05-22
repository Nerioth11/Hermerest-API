<?php

namespace AppBundle\Controller\messaging;

use AppBundle\Entity\Circular;
use AppBundle\Facade\CircularFacade;
use AppBundle\Facade\StudentFacade;
use AppBundle\Utils\AttachmentManager;
use AppBundle\Utils\ResponseFactory;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use DateTime;

class CircularsController extends Controller
{
    /**
     * @Route("/messaging/circulars", name="circulars")
     */
    public function circularsAction()
    {
        return $this->render('/messaging/circulars.html.twig');
    }

    /**
     * @Route("/messaging/circulars/sendCircular", name="send_circular")
     * @Method("POST")
     */
    public function sendCircularAction(Request $request)
    {
        $circularFacade = new CircularFacade($this->getDoctrine()->getManager());

        $centre = $this->get('security.token_storage')->getToken()->getUser()->getCentre();
        $subject = $request->request->get('subject');
        $message = $request->request->get('message');
        $fileName = $request->request->get('fileName');
        $fileContent = $request->request->get('fileContent');
        $sendingDate = new DateTime();
        date_timezone_set($sendingDate, timezone_open('Atlantic/Canary'));

        $circular = new Circular($subject, $message, $sendingDate, $centre);
        $circularFacade->create($circular);

        if ($fileName != null) AttachmentManager::attachFileToMessage($fileName, $fileContent, $circular, $this->getDoctrine()->getManager());

        $this->sendCircular($request->request->get('studentsIds'), $circular, $circularFacade);

        return ResponseFactory::createJsonResponse(true, [
            'id' => $circular->getId(),
            'subject' => $circular->getSubject(),
        ]);
    }

    /**
     * @Route("/messaging/circulars/getCircular", name="get_circular")
     * @Method("GET")
     */
    public function getCircularAction(Request $request)
    {
        $circularFacade = new CircularFacade($this->getDoctrine()->getManager());
        $circularId = $request->query->get('id');
        $circular = $circularFacade->find($circularId);
        $circularAttachment = count($circular->getAttachments()) == 0 ? null : $circular->getAttachments()[0];

        return ResponseFactory::createJsonResponse(true, [
            'subject' => $circular->getSubject(),
            'message' => $circular->getMessage(),
            'sendingDate' => $circular->getSendingDate(),
            'attachmentId' => $circularAttachment == null ? null : $circularAttachment->getId(),
            'attachmentName' => $circularAttachment == null ? null : $circularAttachment->getName()
        ]);
    }

    private function sendCircular($studentsIds, $circular, $circularFacade)
    {
        $studentFacade = new StudentFacade($this->getDoctrine()->getManager());
        foreach ($studentsIds as $studentId) {
            $circular->addStudent($studentFacade->find($studentId));
            $circularFacade->edit();
        }
    }
}
