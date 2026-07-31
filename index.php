<?php
require __DIR__ . '/config.php';
session_name('earn_survey_player'); session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['start_survey'])) {
  $name = trim($_POST['player_name'] ?? ''); $country = $_POST['country'] ?? '';
  if ($name !== '' && in_array($country, ['Egypt', 'USA', 'Morocco'], true)) {
    $_SESSION['player_name'] = $name; $_SESSION['country'] = $country;
    header('Location: index.php'); exit;
  }
  $start_error = 'يرجى كتابة الاسم واختيار البلد.';
}
if (!isset($_SESSION['player_name'])): ?>
<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Survey Egypt</title><link rel="icon" type="image/png" href="assets/logo.png"><link rel="stylesheet" href="assets/style.css"></head>
<body class="welcome-page"><main class="welcome-card"><img class="welcome-logo" src="assets/logo.png" alt="Survey Egypt"><span class="eyebrow">استبيان مدفوع</span><h1>شارك في بناء نموذج مصري أفضل</h1><p>ابدأ بإدخال اسمك وبلدك، ثم انتقل إلى الاستبيان.</p><?php if(isset($start_error)): ?><p class="form-error"><?= e($start_error) ?></p><?php endif; ?><form method="post" class="start-form"><label>الاسم<input name="player_name" maxlength="60" required autocomplete="name" placeholder="اكتب اسمك"></label><label>البلد<select name="country" required><option value="" selected disabled>اختر بلدك</option><option value="Egypt">Egypt</option><option value="USA">USA</option><option value="Morocco">Morocco</option></select></label><button class="submit" name="start_survey">ابدأ الاستبيان <span>←</span></button></form></main></body></html>
<?php exit; endif; $questions = questions(); $playerName = $_SESSION['player_name']; $country = $_SESSION['country']; ?>
<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Survey Egypt</title><link rel="icon" type="image/png" href="assets/logo.png"><link rel="stylesheet" href="assets/style.css"></head>
<body><main class="container">
  <header class="hero"><span class="eyebrow">استبيان مدفوع</span><h1>شارك رأيك. واحصل على مقابل.</h1><p>أجب عن الأسئلة بوضوح، وبعد المراجعة تُضاف قيمة الإجابات المقبولة إلى رصيدك.</p><div class="total"><span>إجمالي القيمة المحتملة</span><strong>76 جنيه</strong></div></header>
  <section class="personal-welcome"><h2>أزيك يا <?= e($playerName) ?></h2><p>بنشكرك جدًا على تعاونك لنبني أفضل نموذج ذكاء اصطناعي مصري بجودة عالية، ونتمنى تكون الأسئلة خفيفة على قلبك.</p></section>
  <section class="notice" id="consent-notice"><div class="notice-mark">!</div><div><h2>تنبيه مهم</h2><p>نرجو أن تجيب بنفسك، ومن واقع تجربتك ورأيك الشخصي، دون الاستعانة بأدوات الذكاء الاصطناعي مثل ChatGPT أو Gemini أو غيرها. نجمع هذه الإجابات لأغراض تدريب نموذج جديد، لذلك لا تُحتسب الإجابات المولّدة آليًا أو المنسوخة، وقد تُستبعد من التقييم.</p><p>اجعل إجاباتك واضحة وصريحة وتعبر عنك فعلًا، حتى لو كانت مختصرة.</p><button class="consent" id="consent-button" type="button">أوافق وأبدأ الإجابة</button></div></section>
  <div id="survey-content" hidden>
  <section class="steps"><span>1. أجب</span><i></i><span>2. نراجع</span><i></i><span>3. اسحب رصيدك</span></section>
  <aside class="earned-dock" aria-live="polite"><span class="coin">ج</span><div><small>رصيدك المحتمل</small><strong><span id="potential-balance">0</span> جنيه</strong></div></aside>
  <form id="survey" action="submit.php" method="post">
    <div class="intro"><h2>الأسئلة</h2><p>لكل سؤال حد أدنى بسيط من الأحرف لضمان إجابة مفيدة.</p></div>
    <?php foreach ($questions as $index=>$q): ?><article class="question-card" data-reward="<?= $q['amount'] ?>"><div class="question-head"><span class="number"><?= $index+1 ?></span><span class="reward"><?= $q['amount'] ?> جنيه</span></div><label for="q<?= $q['id'] ?>"><?= e($q['text']) ?></label><textarea id="q<?= $q['id'] ?>" name="answers[<?= $q['id'] ?>]" minlength="<?= $q['min'] ?>" required data-min="<?= $q['min'] ?>" placeholder="اكتب إجابتك هنا..."></textarea><div class="question-footer"><div class="char-note">الحد الأدنى <span>0</span>/<?= $q['min'] ?> حرف</div><button class="complete-answer" type="button" disabled>خلصت <span>✓</span></button></div></article><?php endforeach; ?>
    <section class="contact"><h2>بيانات استلام الرصيد</h2><p>لن يُستخدم الرقم إلا للتواصل وتحويل الرصيد بعد اعتماد الإجابات.</p><input type="hidden" name="name" value="<?= e($playerName) ?>"><input type="hidden" name="country" value="<?= e($country) ?>"><label>رقم الموبايل<input name="phone" inputmode="tel" pattern="01[0125][0-9]{8}" required placeholder="01xxxxxxxxx"></label><div class="cash-method"><span class="vodafone-logo"><b></b>vodafone</span><div><strong>السحب عبر فودافون كاش</strong><small>يُحوّل الرصيد المعتمد إلى نفس الرقم المسجل.</small></div><span class="selected">مُختار</span></div><input type="hidden" name="withdrawal_method" value="vodafone_cash"></section>
    <button class="submit" type="submit">إرسال الإجابات للمراجعة <span>←</span></button><p class="once">يمكن إرسال الاستبيان مرة واحدة فقط من نفس الاتصال.</p><p class="payment-note">يتم إرسال المقابل المالي للإجابات المعتمدة وفقًا للقواعد فقط.</p>
  </form></div>
  <footer class="site-footer"><img src="assets/logo.png" alt="Survey Egypt"><span>Survey Egypt</span></footer>
</main><script src="assets/app.js"></script></body></html>
