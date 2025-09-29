<?php
// Настройка отправки
require 'config.php';

//От кого письмо
$mail->setFrom('artur_exuzian@mail.ru'); // указать нужный  E-mail
//Кому відправити
$mail->addAddress('artur_exuzian@mail.ru'); // указать нужный  E-mail
//Тема листа
$mail->Subject = 'Заявка на консультацию';


 $name = $_POST['fullName'] ?? 'Не указано';
    $email = $_POST['formEmail'] ?? 'Не указано';
		$phone = $_POST['phone'] ?? 'Не указано';
		$service = $_POST['service'] ?? 'Не указано';
    $message = $_POST['message'] ?? 'Нет сообщения';

//Тело письма
$body = "Имя: $name
<br>Email: $email
<br>Номер-телефона: $phone
<br>Услуга: $service
<br>Сообщение: $message
"
;

if(trim(!empty($_POST['email']))){
$body.=$_POST['email'];
}	

/*
	//Прикріпити файл
	if (!empty($_FILES['image']['tmp_name'])) {
		//шлях завантаження файлу
		$filePath = __DIR__ . "/files/sendmail/attachments/" . $_FILES['image']['name']; 
		//грузимо файл
		if (copy($_FILES['image']['tmp_name'], $filePath)){
			$fileAttach = $filePath;
			$body.='<p><strong>Фото у додатку</strong>';
			$mail->addAttachment($fileAttach);
		}
	}
	*/

$mail->Body = $body;

//Отправляем 
if (!$mail->send()) {
	$message = 'Ошибка';
} else {
	$message = 'Даные высланы!';
}

$response = ['message' => $message];

header('Content-type: application/json');
echo json_encode($response);