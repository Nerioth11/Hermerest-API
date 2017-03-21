<?php

namespace AppBundle\Controller\messaging;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class PollsController extends Controller
{
    /**
     * @Route("/messaging/polls", name="polls")
     */
    public function pollsAction()
    {
        return $this->render('/messaging/polls.html.twig');
    }
}
