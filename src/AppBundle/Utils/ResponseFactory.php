<?php
/**
 * Created by PhpStorm.
 * User: alour
 * Date: 17/04/2017
 * Time: 20:33
 */

namespace AppBundle\Utils;


use Symfony\Component\HttpFoundation\JsonResponse;

class ResponseFactory
{

    public static function createJsonResponse($success, $content)
    {
        return $success ?
            new JsonResponse([
                'success' => true,
                'content' => $content,
            ]) :
            new JsonResponse([
                'success' => false,
                'error' => $content,
            ]);
    }
}