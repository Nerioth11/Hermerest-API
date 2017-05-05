<?php
/**
 * Created by PhpStorm.
 * User: alour
 * Date: 05/05/2017
 * Time: 15:04
 */

namespace AppBundle\Utils;


use AppBundle\Entity\Attachment;
use AppBundle\Facade\AttachmentFacade;

class AttachmentManager
{

    const ATTACHMENTS_DIRECTORY = "C:\\xampp\\htdocs\\Hermerest_attachments\\";

    public static function attachFileToMessage($fileName, $fileContent, $message, $manager)
    {
        $attachmentFacade = new AttachmentFacade($manager);
        $attachment = new Attachment($fileName, $message);
        $attachmentFacade->create($attachment);

        $file = fopen(self::ATTACHMENTS_DIRECTORY . $attachment->getId(), "w");
        fwrite($file, base64_decode($fileContent));
        fclose($file);
    }
}