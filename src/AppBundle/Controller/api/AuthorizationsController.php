<?php
/**
 * Created by PhpStorm.
 * User: Joel
 * Date: 20/06/2017
 * Time: 14:20
 */

namespace AppBundle\Controller\api;


use AppBundle\Facade\AuthorizationFacade;
use AppBundle\Utils\ResponseFactory;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AuthorizationsController extends Controller
{
    public function getAuthorizationsAction($id)
    {
        $authorization = (new AuthorizationFacade($this->getDoctrine()->getManager()))->find($id);
        $authorizationAttachment = count($authorization->getAttachments()) == 0 ? null : $authorization->getAttachments()[0];
        return ResponseFactory::createWebServiceResponse(true, [
            'subject' => $authorization->getSubject(),
            'message' => $authorization->getMessage(),
            'sendingDate' => $authorization->getSendingDate(),
            'limitDate' => $authorization->getLimitDate(),
            'attachmentId' => $authorizationAttachment == null ? null : $authorizationAttachment->getId(),
            'attachmentName' => $authorizationAttachment == null ? null : $authorizationAttachment->getName()
        ]);
    }
}