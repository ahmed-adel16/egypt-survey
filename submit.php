<?php
require __DIR__ . '/config.php';
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Location: index.php'); exit; }
$submissions = load_submissions(); $ip = client_ip();
foreach ($submissions as $s) if (($s['ip_blocked'] ?? true) && isset($s['ip_hash']) && hash_equals($s['ip_hash'], hash('sha256', $ip))) { http_response_code(429); $error='تم إرسال استبيان بالفعل من هذا الاتصال.'; require __DIR__.'/status.php'; exit; }
$answers=$_POST['answers'] ?? []; $clean=[];
foreach (questions() as $q) { $answer=trim((string)($answers[$q['id']] ?? '')); if (mb_strlen($answer) < $q['min']) { http_response_code(422); $error='يرجى استكمال كل الإجابات بالحد الأدنى المطلوب.'; require __DIR__.'/status.php'; exit; } $clean[$q['id']]=$answer; }
$phone=preg_replace('/\D/','',$_POST['phone'] ?? ''); $name=trim($_POST['name'] ?? '');
if (!preg_match('/^01[0125][0-9]{8}$/',$phone) || $name==='') { http_response_code(422); $error='يرجى إدخال الاسم ورقم موبايل مصري صحيح.'; require __DIR__.'/status.php'; exit; }
$country = in_array($_POST['country'] ?? '', ['Egypt', 'USA', 'Morocco'], true) ? $_POST['country'] : '';
$id=bin2hex(random_bytes(8)); $submissions[]=['id'=>$id,'name'=>$name,'country'=>$country,'phone'=>$phone,'ip_hash'=>hash('sha256',$ip),'ip_blocked'=>true,'created_at'=>date('c'),'answers'=>$clean,'decisions'=>[],'withdrawal'=>'requested','withdrawal_method'=>'vodafone_cash']; save_submissions($submissions); require __DIR__.'/status.php';
