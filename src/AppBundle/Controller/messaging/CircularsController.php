<?php

namespace AppBundle\Controller\messaging;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class CircularsController extends Controller
{
    /**
     * @Route("/messaging/circulars", name="circulars")
     */
    public function circularsAction()
    {
        return $this->render('/messaging/circulars.html.twig');
    }
}
