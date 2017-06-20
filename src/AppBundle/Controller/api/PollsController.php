<?php
/**
 * Created by PhpStorm.
 * User: Joel
 * Date: 20/06/2017
 * Time: 14:38
 */

namespace AppBundle\Controller\api;


use AppBundle\Facade\PollFacade;
use AppBundle\Utils\ResponseFactory;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PollsController extends Controller
{
    public function getPollsAction($id)
    {
        $poll = (new PollFacade($this->getDoctrine()->getManager()))->find($id);
        $pollAttachment = count($poll->getAttachments()) == 0 ? null : $poll->getAttachments()[0];
        return ResponseFactory::createWebServiceResponse(true, [
            'subject' => $poll->getSubject(),
            'message' => $poll->getMessage(),
            'sendingDate' => $poll->getSendingDate(),
            'limitDate' => $poll->getLimitDate(),
            'options' => $this->getPollResults($poll),
            'attachmentId' => $pollAttachment == null ? null : $pollAttachment->getId(),
            'attachmentName' => $pollAttachment == null ? null : $pollAttachment->getName()
        ]);
    }

    private function getPollResults($poll): array
    {
        $pollResults = array();
        foreach ($poll->getPollOptions() as $pollOption)
            array_push($pollResults, [
                'name' => $pollOption->getText(),
                'id' => $pollOption->getId()
            ]);
        return $pollResults;
    }
}