<?php
    if($_POST){
        $to = 'your.email@domain.com'; /*Put Your Email Address Here*/
        $subject = "You have been contacted from Water Mobile.";
        $from_name = $_POST['contact-name'];
        $from_email = $_POST['contact-email'];
        $from_phone = $_POST['contact-tel'];
        $message = "<b> Name: " . $from_name . "<br/> Email: " . $from_email . " <br/> Phone: " .  $from_phone . "<br/></b><br/>----------------------------------------------- <br/><br/> " . $_POST['contact-message'];

        $header = "From: $from_name <$from_email>" . "\r\n";

        /*new code*/
        $header .= "Content-type: text/html" . "\r\n"; 

        mail($to, $subject, $message, $header);
        echo "1"; //should echo 0 if there is any error in above mail function.
    }
?>