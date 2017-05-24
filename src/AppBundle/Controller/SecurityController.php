<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class SecurityController extends Controller
{
    public function loginAction(Request $request)
    {
        return $this->render(
            'login.html.twig', array(
            'last_username' => $this->get('security.authentication_utils')->getLastUsername(),
            'error' => $this->get('security.authentication_utils')->getLastAuthenticationError(),
        ));
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout()
    {
    }
}


