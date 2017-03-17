<?php

namespace AppBundle\Controller\messaging;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AuthorizationsController extends Controller
{
    /**
     * @Route("/messaging/authorizations", name="authorizations")
     */
    public function authorizationssAction()
    {
        return $this->render('/messaging/authorizations.html.twig');
    }
}
