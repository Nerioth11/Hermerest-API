<?php

namespace AppBundle\Controller\messaging;

use AppBundle\Entity\Attachment;
use AppBundle\Entity\Circular;
use AppBundle\Facade\AttachmentFacade;
use AppBundle\Facade\CircularFacade;
use AppBundle\Facade\StudentFacade;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
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

        if ($fileName != null) $this->attachFile($fileName, $fileContent, $circular);

        $this->sendCircular($request->request->get('studentsIds'), $circular, $circularFacade);

        return new JsonResponse([
            'sent' => true,
            'sentCircularId' => $circular->getId(),
            'sentCircularSubject' => $circular->getSubject(),
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

        return new JSonResponse([
            'found' => true,
            'circularSubject' => $circular->getSubject(),
            'circularMessage' => $circular->getMessage(),
            'circularSendingDate' => $circular->getSendingDate(),
            'circularAttachmentId' => $circularAttachment == null ? null : $circularAttachment->getId(),
            'circularAttachmentName' => $circularAttachment == null ? null : $circularAttachment->getName()
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

    private function attachFile($fileName, $fileContent, $message)
    {
        $attachmentFacade = new AttachmentFacade($this->getDoctrine()->getManager());
        $attachment = new Attachment($fileName, $message);
        $attachmentFacade->create($attachment);

        $file = fopen("C:\\xampp\\htdocs\\Hermerest_attachments\\" . $attachment->getId(), "w");
        fwrite($file, base64_decode($fileContent));
        fclose($file);
    }
}
