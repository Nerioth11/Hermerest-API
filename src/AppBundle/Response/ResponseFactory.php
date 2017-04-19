<?php
/**
 * Created by PhpStorm.
 * User: alour
 * Date: 17/04/2017
 * Time: 20:33
 */

namespace AppBundle\Response;


use Symfony\Component\HttpFoundation\JsonResponse;

class ResponseFactory
{

    public static function createJsonResponse($success, $content)
    {
        if (!$success) {
            return new JsonResponse([
                'success' => false,
                'error' => $content,
            ]);
        } else {
            return new JsonResponse([
                'success' => true,
                'content' => $content,
            ]);
        }

    }
}