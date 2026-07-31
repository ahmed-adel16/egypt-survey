<?php
// غيّر كلمة المرور قبل رفع الموقع. استخدم متغير ADMIN_PASSWORD على الاستضافة إن أمكن.
const ADMIN_PASSWORD = 'Ahmed12@';
// يبقى ملف البيانات خارج public root حتى لا يمكن تحميل أرقام المستخدمين مباشرة من المتصفح.
const STORAGE_FILE = __DIR__ . '/../new_survey-storage/submissions.json';
const SESSION_NAME = 'earn_survey_admin';

function questions(): array {
    return [
        ['id'=>1, 'text'=>'إيه أول حاجة بتعملها لما تصحى من النوم؟', 'amount'=>5, 'min'=>20],
        ['id'=>2, 'text'=>'لو معاك تذكرة سفر لأي مكان لمدة أسبوع، هتختار تروح فين وليه؟', 'amount'=>7, 'min'=>35],
        ['id'=>3, 'text'=>'إيه أكتر صفة بتخليك ترتاح لشخص من أول تعامل؟', 'amount'=>5, 'min'=>20],
        ['id'=>4, 'text'=>'إيه أكتر صفة بتستنزفك في أي علاقة مع الناس؟', 'amount'=>7, 'min'=>25],
        ['id'=>5, 'text'=>'لو فيه شخص قريب منك بيعمل حاجة بتضايقك، غالبًا بتتصرف إزاي؟', 'amount'=>7, 'min'=>30],
        ['id'=>6, 'text'=>'إيه أكتر حاجة الناس غالبًا بتفهمها غلط عن شخصيتك؟', 'amount'=>7, 'min'=>25],
        ['id'=>7, 'text'=>'لو تقدر تغير عادة واحدة في المجتمع، هتغير إيه؟', 'amount'=>5, 'min'=>25],
        ['id'=>8, 'text'=>'إيه الفرق بين الشخص المهتم والشخص اللي اهتمامه بقى زيادة عن اللزوم؟', 'amount'=>7, 'min'=>35],
        ['id'=>9, 'text'=>'لو رجعت خمس سنين لورا، هتقول لنفسك إيه؟', 'amount'=>7, 'min'=>25],
        ['id'=>10, 'text'=>'إيه أكتر موقف خلاك تغير نظرتك لحد كنت بتحترمه؟', 'amount'=>7, 'min'=>35],
        ['id'=>11, 'text'=>'إيه أكتر حاجة بتخليك تحس بالأمان مع أي شخص؟', 'amount'=>5, 'min'=>20],
        ['id'=>12, 'text'=>'لو تقدر تبعت رسالة مجهولة لأي شخص، هتكتب فيها إيه؟', 'amount'=>7, 'min'=>25],
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
