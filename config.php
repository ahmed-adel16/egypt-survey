<?php
// غيّر كلمة المرور قبل رفع الموقع. استخدم متغير ADMIN_PASSWORD على الاستضافة إن أمكن.
const ADMIN_PASSWORD = 'Ahmed12@';
// يبقى ملف البيانات خارج public root حتى لا يمكن تحميل أرقام المستخدمين مباشرة من المتصفح.
const STORAGE_FILE = __DIR__ . '/../new_survey-storage/submissions.json';
const SESSION_NAME = 'earn_survey_admin';

function start_project_session(string $name): void {
    $directory = rtrim(sys_get_temp_dir(), DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'earn-survey-sessions';
    if (!is_dir($directory)) mkdir($directory, 0775, true);
    session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'httponly' => true, 'samesite' => 'Lax']);
    session_save_path($directory);
    session_name($name);
    session_start();
}

function questions(): array {
    return [
        ['id'=>1, 'text'=>'إيه أول إحساس بيكون عندك لما يبقى عندك يوم فاضي؟', 'amount'=>5, 'min'=>20],
        ['id'=>2, 'text'=>'إيه نوع الخروجة اللي بتحبها أكتر: لوحدك ولا مع صاحبك؟ وليه؟', 'amount'=>7, 'min'=>30],
        ['id'=>3, 'text'=>'إيه أهم صفة لازم تكون موجودة في الصاحب الحقيقي من وجهة نظرك؟', 'amount'=>7, 'min'=>25],
        ['id'=>4, 'text'=>'إيه الحاجة اللي ممكن تخليك تلغي خروجة كنت متحمس لها؟', 'amount'=>5, 'min'=>20],
        ['id'=>5, 'text'=>'إيه التصرف اللي يخليك تبعد عن شخص حتى لو كنت بتحبه؟', 'amount'=>7, 'min'=>25],
        ['id'=>6, 'text'=>'لو فيه حد عايز يصاحبك أو يقرب منك، وأنت مش مهتم أوي، هتتصرف معاه إزاي؟', 'amount'=>7, 'min'=>30],
        ['id'=>7, 'text'=>'إيه نوع المواقف اللي بتحس فيها إنك محتاج صاحب جنبك؟', 'amount'=>7, 'min'=>25],
        ['id'=>8, 'text'=>'إيه عادة صغيرة في يومك بتحس إنها بتفرق معاك؟', 'amount'=>5, 'min'=>25],
        ['id'=>9, 'text'=>'لو هتختار مكان هادي تقضي فيه يوم كامل، تتخيله فين؟', 'amount'=>7, 'min'=>35],
        ['id'=>10, 'text'=>'إيه نوع الكلام اللي بيخليك تحس إن اللي قدامك فاهمك؟', 'amount'=>5, 'min'=>25],
        ['id'=>11, 'text'=>'إيه موقف بسيط ممكن يثبت لك إن شخص قدامك جدع؟', 'amount'=>7, 'min'=>35],
        ['id'=>12, 'text'=>'لو عندك ساعتين زيادة كل يوم، هتستغلهم في إيه؟', 'amount'=>7, 'min'=>25],
        ['id'=>13, 'text'=>'إيه قرار صغير أخدته وفرق معاك بعد كده؟', 'amount'=>7, 'min'=>35],
        ['id'=>14, 'text'=>'إيه أكتر حاجة بتخليك تحس بالأمان مع صاحبك؟', 'amount'=>5, 'min'=>20],
        ['id'=>15, 'text'=>'لو تقدر تبعت رسالة مجهولة لصاحب قديم، هتكتب فيها إيه؟', 'amount'=>7, 'min'=>25],
        ['id'=>16, 'text'=>'إيه درس مهم اتعلمته من صداقة مرت عليك؟', 'amount'=>7, 'min'=>25],
    ];
}

function load_submissions(): array {
    if (!file_exists(STORAGE_FILE)) return [];
    $data = json_decode(file_get_contents(STORAGE_FILE), true);
    return is_array($data) ? $data : [];
}
function save_submissions(array $items): void {
    file_put_contents(STORAGE_FILE, json_encode($items, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
}
function client_ip(): string {
    // لا تثق بـ X-Forwarded-For إلا إذا كان الموقع خلف proxy موثوق ومُعدّ لذلك.
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}
function e(string $value): string { return htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); }
