<?php

if(isset($_POST["submit"])) {
    $name = $_POST["name"];
    $subject = $_POST["subject"];
    $mailFrom = $_POST["mail"];
    $message = $_POST["message"];

    $mailTo = "brighamaldrich@gmail.com";
    $headers = "From: ".mailFrom;
    // $txt = "This is an email from brighamaldrich.com. The sender is ".$name.".\n\n".$message;
    $txt = "BRIGHAMALDRICH.COM"."\n"."From: ".$mailFrom."\n"."Name: ".$name."\n\n".$message;

    mail($mailTo, $subject, $txt, $headers);
    header("Location: index.html?mailsent");
}