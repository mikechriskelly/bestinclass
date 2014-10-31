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
		$headers = "From: Web <noreply@bestinclasseducation.com>\r\n";
    $headers .= "Bcc: office@bestinclasseducation.com\r\n";
		
		if (filter_var($data['email'], FILTER_VALIDATE_EMAIL)) 
			$headers .= "Reply-To: " . $data['email'];
		
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
		$headers = "From: Web <noreply@bestinclasseducation.com>\r\n";
		
		if (filter_var($data['email'], FILTER_VALIDATE_EMAIL)) 
			$headers .= "Reply-To: " . $data['email'];
		
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
		$headers = "From: Web <noreply@bestinclasseducation.com>\r\n";
		
		if (filter_var($data['email'], FILTER_VALIDATE_EMAIL)) 
			$headers .= "Reply-To: " . $data['email'];
		
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
		$mail->FromName = 'Web';
    
		if (filter_var($data['email'], FILTER_VALIDATE_EMAIL))
			$mail->addReplyTo = $data['email'];
		
		$message = 'Name: ' . $data['name'] .
		"\nEmail: " . $data['email'] .
		"\nPhone: " . $data['phone'] . 
		"\nPosition: " . $data['position'] . 
		"\nCenter: " . $data['center'] .
		"\n\nComments: " . $data['comments'] .
		"\n\nLogged from " . $_SERVER['REMOTE_ADDR'];
	
		// add attachment if no errors
		if ($_FILES['file']["error"] > 0)
		{
			// upload error
			$error = "\n\nError: " . $_FILES["file"]["error"];
			$message = $message . $error;
			$mail->Body = $message;
		}
		else
		{
			// filter attachments
			$filename = $_FILES['file']['name'];
			$file_extension = pathinfo($filename, PATHINFO_EXTENSION);
			$allowed = array('doc','docx','pdf','rtf','txt');
			
			if (in_array($file_extension, $allowed))
				$mail->addAttachment($_FILES["file"]["tmp_name"], $_FILES["file"]["name"]);
			
			$mail->Body = $message;
		}
		if($mail->send())
		{
			header('Content-type: application/json');
			header("Location: /confirmation/apply");
			echo json_encode(array('message' => 'success'));
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
	
	if ($result == true)
	{
		header('Content-type: application/json');
		echo json_encode(array('message' => 'success'));
	}
	else
	{
		header('HTTP/1.1 500 Internal Server Error');
		header('Content-Type: application/json; charset=UTF-8');
		die(json_encode(array('message' => 'ERROR', 'code' => 'email')));
	}
}

?>