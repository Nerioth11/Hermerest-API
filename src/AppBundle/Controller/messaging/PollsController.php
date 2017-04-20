<?php

namespace AppBundle\Controller\messaging;

use AppBundle\Entity\Poll;
use AppBundle\Facade\PollFacade;
use DateTime;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class PollsController extends Controller
{
    /**
     * @Route("/messaging/polls", name="polls")
     */
    public function pollsAction()
    {
        return $this->render('/messaging/polls.html.twig');
    }

    /**
     * @Route("/messaging/polls/sendPoll", name="send_poll")
     * @Method("POST")
     */
    public function sendPollAction(Request $request)
    {
        $pollFacade = new PollFacade($this->getDoctrine()->getManager());

        $centre = $this->get('security.token_storage')->getToken()->getUser()->getCentre();
        $subject = $request->request->get('subject');
        $limitDate = date_create_from_format('Y-m-d G:i:s',$request->request->get('limitDate') . " 23:59:59", new DateTimeZone('UTC'));
        $message = $request->request->get('message');
        $sendingDate = new DateTime();

        $poll = new Poll($subject, $message, $sendingDate, $centre, $limitDate);
        $pollFacade->create($poll);

        return new JsonResponse([
            'sent' => true,
            'sentPollId' => $poll->getId(),
            'sentPollLimitDate' => $poll->getLimitDate(),
            'sentPollSubject' => $poll->getSubject(),
        ]);
    }

    /**
     * @Route("/messaging/polls/getPoll", name="get_poll")
     * @Method("GET")
     */
    public function getPollAction(Request $request)
    {
        $pollFacade = new PollFacade($this->getDoctrine()->getManager());
        $pollId = $request->query->get('id');
        $poll = $pollFacade->find($pollId);

        return new JSonResponse([
            'found' => true,
            'pollSubject' => $poll->getSubject(),
            'pollMessage' => $poll->getMessage(),
            'pollSendingDate' => $poll->getSendingDate(),
            'pollLimitDate' => $poll->getLimitDate(),
        ]);
    }
}
