"use client";
import { useEffect, useState } from "react";
const oldQuestions = [
  "إيه أول حاجة بتعملها لما تصحى من النوم؟",
  "لو معاك تذكرة سفر لأي مكان لمدة أسبوع، هتختار تروح فين وليه؟",
  "إيه أكتر صفة بتخليك ترتاح لشخص من أول تعامل؟",
  "إيه أكتر صفة بتستنزفك في أي علاقة مع الناس؟",
  "لو فيه شخص قريب منك بيعمل حاجة بتضايقك، غالبًا بتتصرف إزاي؟",
  "إيه أكتر حاجة الناس غالبًا بتفهمها غلط عن شخصيتك؟",
  "لو تقدر تغير عادة واحدة في المجتمع، هتغير إيه؟",
  "إيه الفرق بين الشخص المهتم والشخص اللي اهتمامه بقى زيادة عن اللزوم؟",
  "لو رجعت خمس سنين لورا، هتقول لنفسك إيه؟",
  "إيه أكتر موقف خلاك تغير نظرتك لحد كنت بتحترمه؟",
  "إيه أكتر حاجة بتخليك تحس بالأمان مع أي شخص؟",
  "لو تقدر تبعت رسالة مجهولة لأي شخص، هتكتب فيها إيه؟",
];
const q = ['إيه أول إحساس بيكون عندك لما يبقى عندك يوم فاضي؟','إيه نوع الخروجة اللي بتحبها أكتر: لوحدك ولا مع صاحبك؟ وليه؟','إيه أهم صفة لازم تكون موجودة في الصاحب الحقيقي من وجهة نظرك؟','إيه الحاجة اللي ممكن تخليك تلغي خروجة كنت متحمس لها؟','إيه التصرف اللي يخليك تبعد عن شخص حتى لو كنت بتحبه؟','لو فيه حد عايز يصاحبك أو يقرب منك، وأنت مش مهتم أوي، هتتصرف معاه إزاي؟','إيه نوع المواقف اللي بتحس فيها إنك محتاج صاحب جنبك؟','إيه عادة صغيرة في يومك بتحس إنها بتفرق معاك؟','لو هتختار مكان هادي تقضي فيه يوم كامل، تتخيله فين؟','إيه نوع الكلام اللي بيخليك تحس إن اللي قدامك فاهمك؟','إيه موقف بسيط ممكن يثبت لك إن شخص قدامك جدع؟','لو عندك ساعتين زيادة كل يوم، هتستغلهم في إيه؟','إيه قرار صغير أخدته وفرق معاك بعد كده؟','إيه أكتر حاجة بتخليك تحس بالأمان مع صاحبك؟','لو تقدر تبعت رسالة مجهولة لصاحب قديم، هتكتب فيها إيه؟','إيه درس مهم اتعلمته من صداقة مرت عليك؟'];
const questions = [
  'لو تقدر تتعلم مهارة واحدة فورًا من غير وقت أو مجهود، هتختار إيه؟ وإزاي هتستخدمها في حياتك؟',
  'لو حصل سوء تفاهم بينك وبين صاحب قريب منك، بتحب تحل الموضوع إزاي؟ وإيه اللي ممكن يصعّب الصلح؟',
  'إيه حاجة بسيطة في يومك بتفرق جدًا في مزاجك، حتى لو الناس شايفاها عادية؟',
  'احكي عن موقف خلاك تكتشف إن شخص معين صاحب جدع فعلًا. عمل إيه، وإيه اللي فرق معاك في الموقف؟',
  'لو عندك أسبوع إجازة من كل مسؤولياتك، هتعمل فيه إيه من أول يوم لآخر يوم؟ وليه؟',
  'إيه الصفات اللي لازم تكون موجودة في الصاحب الحقيقي عشان تقدر تثق فيه وتحكيله براحتك؟',
  'احكي عن قرار صغير أخدته وغيّر طريقة تفكيرك أو أثّر في حياتك بشكل أكبر مما كنت متوقع.',
  'لو فيه حد عايز يصاحبك أو يقرب منك، بس إنت مش مهتم أوي، هتتصرف معاه إزاي بشكل محترم؟ وليه؟',
  'صف يوم خروجة مثالي بالنسبالك. تحب تقضيه لوحدك ولا مع صاحب قريب منك؟ وإيه اللي يخليه يوم حلو؟',
  'إيه أهم درس اتعلمته من صداقة انتهت، أو اتغيرت، أو بقت أقوى مع الوقت؟',
];
const prices = Array(10).fill(10);
export default function Page() {
  const [n, setN] = useState(""),
    [country, setCountry] = useState(""),
    [started, setStarted] = useState(false),
    [ok, setOk] = useState(false),
    [answers, setAnswers] = useState(Array(10).fill("")),
    [phone, setPhone] = useState(""),
    [done, setDone] = useState([]),
    [message, setMessage] = useState("");
  useEffect(() => { try { const d = JSON.parse(sessionStorage.getItem('survey-draft-v2') || '{}'); if (d.n) { setN(d.n); setCountry(d.country); setStarted(d.started); setOk(d.ok); setAnswers(d.answers || Array(10).fill('')); setPhone(d.phone || ''); setDone(d.done || []); } } catch {} }, []);
  useEffect(() => { sessionStorage.setItem('survey-draft-v2', JSON.stringify({n,country,started,ok,answers,phone,done})); }, [n,country,started,ok,answers,phone,done]);
  const total = done.reduce((x, i) => x + prices[i], 0);
  async function send(e) {
    e.preventDefault();
    if (done.length !== questions.length) return alert("أكمل كل الأسئلة واضغط خلصت.");
    let r = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: n,
        country,
        phone,
        answers: Object.fromEntries(answers.map((x, i) => [i + 1, x])),
        decisions: {},
        withdrawal: "requested",
        withdrawal_method: "vodafone_cash",
      }),
    });
    setMessage(r.ok ? "تم إرسال إجاباتك للمراجعة." : (await r.json()).error);
  }
  if (message)
    return (
      <main className="status-wrap">
        <div className="status-card">
          <h1>{message}</h1>
        </div>
      </main>
    );
  if (!started)
    return (
      <main className="welcome-page">
        <section className="welcome-card">
          <img className="welcome-logo" src="/logo.png" />
          <h1>شارك في بناء نموذج مصري أفضل</h1>
          <form
            className="start-form"
            onSubmit={(e) => {
              e.preventDefault();
              setStarted(true);
            }}
          >
            <input
              required
              value={n}
              onChange={(e) => setN(e.target.value)}
              placeholder="اسمك"
            />
            <select
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">اختر بلدك</option>
              <option>Egypt</option>
              <option>USA</option>
              <option>Morocco</option>
            </select>
            <button className="submit">ابدأ</button>
          </form>
        </section>
      </main>
    );
  if (!ok)
    return (
      <main className="container">
        <header className="hero">
          <h1>أزيك يا {n}</h1>
          <p>
            بنشكرك جدًا على تعاونك لنبني أفضل نموذج ذكاء اصطناعي مصري بجودة
            عالية.
          </p>
        </header>
        <section className="notice">
          <div className="notice-mark">!</div>
          <div>
            <h2>تنبيه مهم</h2>
            <p>
              نرجو أن تجيب بنفسك ومن واقع تجربتك، دون الاستعانة بأدوات الذكاء
              الاصطناعي. نجمع هذه الإجابات لتدريب نموذج جديد، لذلك لا تُحتسب
              الإجابات المولّدة آليًا أو المنسوخة.
            </p>
            <p>اجعل إجاباتك واضحة وصريحة وتعبر عن رأيك الحقيقي.</p>
            <button className="consent" onClick={() => setOk(true)}>
              أوافق وأبدأ الإجابة
            </button>
          </div>
        </section>
      </main>
    );
  return (
    <main className="container">
      <header className="hero">
        <h1>أزيك يا {n}</h1>
        <p>
          بنشكرك جدًا على تعاونك لنبني أفضل نموذج ذكاء اصطناعي مصري بجودة عالية.
        </p>
      </header>
      <aside className="earned-dock" aria-live="polite">
        <span className="coin">ج</span>
        <div><small>رصيدك المحتمل</small><strong>{total} جنيه</strong></div>
      </aside>
      <form onSubmit={send}>
        {questions.map((x, i) => (
          <article
            className={
              "question-card " + (done.includes(i) ? "is-complete" : "")
            }
            key={x}
          >
            <div className="question-head">
              <span>{i + 1}</span>
              <b className="reward">{prices[i]} جنيه</b>
            </div>
            <label>{x}</label>
            <textarea
              required
              minLength="20"
              value={answers[i]}
              onChange={(e) => {
                let a = [...answers];
                a[i] = e.target.value;
                setAnswers(a);
                setDone(done.filter((v) => v !== i));
              }}
            />
            <button
              type="button"
              className="complete-answer"
              disabled={answers[i].trim().length < 20}
              onClick={() => setDone([...new Set([...done, i])])}
            >
              خلصت
            </button>
          </article>
        ))}
        <section className="contact">
          <label>
            رقم فودافون كاش
            <input
              required
              pattern="01[0125][0-9]{8}"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
          <div className="cash-method">
            <span className="vodafone-logo"><b></b>vodafone</span>
            <div><strong>السحب عبر فودافون كاش</strong><small>سيتم التحويل إلى نفس الرقم المسجل بعد اعتماد الإجابات.</small></div>
            <span className="selected">مُختار</span>
          </div>
        </section>
        <button className="submit">إرسال للمراجعة</button>
      </form>
      <footer className="site-footer">
        <img src="/logo.png" />
        Survey Egypt
      </footer>
    </main>
  );
}
