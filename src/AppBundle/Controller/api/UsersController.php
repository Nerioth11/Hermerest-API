<?php
/**
 * Created by PhpStorm.
 * User: Joel
 * Date: 14/06/2017
 * Time: 1:42
 */

namespace AppBundle\Controller\api;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;

class UsersController
{
    /**
     * @Route("/api/users")
     * @Method("POST")
     */
    public function createUsersAction(Request $request)
    {
        $data = array("nombre" => $request->request->get("hola"));

        return $data;
    }

    /**
     * @Route("/api/users")
     * @Method("GET")
     */
    public function getUsersAction(Request $request)
    {
        $data = array("nombre" => $request->query->get("hola"));

        return $data;
    }
}