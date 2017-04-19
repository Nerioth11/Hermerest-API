<?php

namespace AppBundle\Controller\messaging;

use AppBundle\Entity\Circular;
use AppBundle\Facade\CircularFacade;
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
        $sendingDate = new DateTime();

        $circular = new Circular($subject, $message, $sendingDate, $centre);
        $circularFacade->create($circular);

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

        return new JSonResponse([
            'found' => true,
            'circularSubject' => $circular->getSubject(),
            'circularMessage' => $circular->getMessage(),
            'circularSendingDate' => $circular->getSendingDate(),
        ]);
    }
}
