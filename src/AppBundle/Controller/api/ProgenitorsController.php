<?php
/**
 * Created by PhpStorm.
 * User: Joel
 * Date: 14/06/2017
 * Time: 1:42
 */

namespace AppBundle\Controller\api;

use AppBundle\Entity\Progenitor;
use AppBundle\Facade\ProgenitorFacade;
use AppBundle\Utils\ResponseFactory;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class ProgenitorsController extends Controller
{
    public function getParentsAction(Request $request)
    {
        $telephone = $request->query->get("telephone");
        $parent = (new ProgenitorFacade($this->getDoctrine()->getManager()))->findByTelephone($telephone);
        return ResponseFactory::createWebServiceResponse($parent !== null,
            $parent === null ?
                'No se encontró el padre' :
                ['id' => $parent->getId(), 'name' => $parent->getName(), 'telephone' => $parent->getTelephone()]
        );
    }

    public function postParentsAction(Request $request)
    {
        $name = $request->request->get("name");
        $telephone = $request->request->get("telephone");
        $parent = new Progenitor($name, $telephone);
        (new ProgenitorFacade($this->getDoctrine()->getManager()))->create($parent);
        return ResponseFactory::createWebServiceResponse(true, [
            'id' => $parent->getId(),
            'name' => $parent->getName(),
            'telephone' => $parent->getTelephone()
        ]);
    }

    public function getParentMessagesAction($id, Request $request)
    {
        $type = $request->query->get("type");
        $parent = (new ProgenitorFacade($this->getDoctrine()->getManager()))->find($id);
        $messages = $parent->getMessagesOfType($type);
        return ResponseFactory::createWebServiceResponse(true, $this->getMessagesArray($messages, $type));
    }

    private function getMessagesArray($messages, $type): array
    {
        $messagesArray = [];
        foreach ($messages as $message) {
            array_push($messagesArray,  [
                'id' => $message->getId(),
                'subject' => $message->getSubject(),
                'sendingDate' => $message->getSendingDate(),
                'attachment' => count($message->getAttachments()) > 0 ? true : false,
                'limitDate' => ($type == 'Authorization' || $type == 'Poll') ? $message->getlimitDate() : null,
            ]);
        }
        return $messagesArray;
    }
}