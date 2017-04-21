<?php

namespace AppBundle\Controller;

use AppBundle\Facade\AdministratorFacade;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class AccountController extends Controller
{
    /**
     * @Route("/account", name="account")
     */
    public function accountAction()
    {
        return $this->render('account.html.twig');
    }

    /**
     * @Route("/account/edit", name="edit_account")
     * @Method("POST")
     */
    public function deleteStudentAction(Request $request)
    {
        $administratorFacade = new AdministratorFacade($this->getDoctrine()->getManager());
        $administrator = $this->get('security.token_storage')->getToken()->getUser();
        $user = $request->request->get('user');
        $name = $request->request->get('name');
        $oldPassword = $request->request->get('oldPassword');
        $newPassword = $request->request->get('newPassword');

        if (md5($oldPassword) != $administrator->getPassword()) {
            return new JsonResponse([
                'edited' => false,
                'error' => "La contraseña actual no es correcta"
            ]);
        }

        $administrator->setUser($user);
        $administrator->setName($name);
        if (strlen($newPassword) >= 4 && strlen($newPassword) <= 16)
            $administrator->setPassword(md5($newPassword));

        $administratorFacade->edit();

        return new JsonResponse([
            'edited' => true,
            'editedAdministratorUser' => $administrator->getUser(),
            'editedAdministratorName' => $administrator->getName(),
        ]);
    }
}
