<?php
// detect bots that fill in all fields
if ($_POST['answer'] != "")
{
	header('HTTP/1.1 403 Forbidden');
    header('Content-Type: application/json; charset=UTF-8');
    die(json_encode(array('message' => 'ERROR', 'code' => 'bot')));
}
else // process submit
{
	// deserialize data
	//$jsondata = $_POST;
	//$data = json_decode($jsondata, true);
	$data = $_POST;
	
	if ($data['form-name'] == 'contact-form')
	{
		$to = $data['center'] . '@bestinclasseducation.com';
		$subject = 'Feedback from ' . $data['person'];
		$headers = "From: <noreply@bestinclasseducation.com>\n";
		
		$message = 'Name: ' . $data['name'] .
		"\nEmail: " . $data['email'] .
		"\nPhone: " . $data['phone'] . 
		"\nPerson: " . $data['person'] . 
		"\n\nComments: " . $data['comments'] .
		"\n\n\nLogged from " . $_SERVER['REMOTE_ADDR'];
	}
	else if ($data['form-name'] == 'signup-form')
	{
		$to = $data['center'] . '@bestinclasseducation.com';
		$subject = 'Enrollment request from ' . $data['parentname'];
		$headers = "From: <noreply@bestinclasseducation.com>\n";
		
		$message = 'Parent Name: ' . $data['parentname'] .
		"\nEmail: " . $data['email'] .
		"\nPhone: " . $data['phone'] . 
		"\nProgram: " . $data['program'] . 
		"\nGrade: " . $data['grade'] .
		"\nDay: " . $data['day'] .
		"\n\nComments: " . $data['comments'] .
		"\n\n\nLogged from " . $_SERVER['REMOTE_ADDR'];
	}
	else if ($data['form-name'] == 'mForm')
	{
		$to = $data['center'] . '@bestinclasseducation.com';
		$subject = 'Makeup request for ' . $data['studentname'];
		$headers = "From: <noreply@bestinclasseducation.com>\n";
		
		$message = 'Student: ' . $data['studentname'] .
		'\nParent: ' . $data['parentname'] .
		"\nEmail: " . $data['email'] .
		"\nPhone: " . $data['phone'] . 
		"\nScheduled Day: " . $data['mRegDay'] . 
		"\nScheduled Time: " . $data['mRegTime'] .
		"\nDesired Day: " . $data['mNewDay'] . 
		"\nDesired Time: " . $data['mNewTime'] .
		"\n\nComments: " . $data['comments'] .
		"\n\n\nLogged from " . $_SERVER['REMOTE_ADDR'];
	}
	else if ($data['form-name'] == 'career-form')
	{
		require 'PHPMailer/PHPMailerAutoload.php';
		$mail = new PHPMailer;
		
		$mail->addAddress($data['center'] . '@bestinclasseducation.com');
		$mail->Subject = 'Resume for '. $data['position'] . ' from ' . $data['name'];
		$mail->From = "noreply@bestinclasseducation.com";
		
		$mail->Body = 'Name: ' . $data['name'] .
		"\nEmail: " . $data['email'] .
		"\nPhone: " . $data['phone'] . 
		"\nPosition: " . $data['position'] . 
		"\nCenter: " . $data['center'] .
		"\n\nComments: " . $data['comments'] .
		"\n\n\nLogged from " . $_SERVER['REMOTE_ADDR'];
	
		if ($_FILES["file"]["error"] > 0)
		{
			$mail->addAttachment($_FILES["file"]["tmp_name"]);
		}
		if($mail->send())
		{
			header("Location: /confirmation/apply");
			exit;
		}
		else echo "Error. Please go back and try again.";
	}
	else 
	{
		header('HTTP/1.1 500 Internal Server Error');
		header('Content-Type: application/json; charset=UTF-8');
		die(json_encode(array('message' => 'ERROR', 'code' => 'email')));
	}
	$result = mail($to, $subject, $message, $headers);
	
	if ($result == false)
	{
		header('HTTP/1.1 500 Internal Server Error');
		header('Content-Type: application/json; charset=UTF-8');
		die(json_encode(array('message' => 'ERROR', 'code' => 'email')));
	}
}

?>