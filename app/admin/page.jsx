'use client';

import { useMemo, useState } from 'react';
import { rewardPerQuestion, surveyQuestions } from '../questions';

const headersFor = (password) => ({
  'x-admin-password': password,
  'Content-Type': 'application/json',
});

function getAnswerEntries(submission) {
  return Object.entries(submission.answers || {}).sort(
    ([first], [second]) => Number(first) - Number(second),
  );
}

function approvedTotal(submission) {
  return getAnswerEntries(submission).reduce((total, [number]) => (
    submission.decisions?.[number] === 'approved'
      ? total + rewardPerQuestion
      : total
  ), 0);
}

function IpIdentifier({ submission }) {
  const fingerprint = submission.ip_hash
    ? `${submission.ip_hash.slice(0, 14)}…`
    : 'No IP identifier';

  return <>{submission.ip_address || `IP fingerprint: ${fingerprint}`}</>;
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('responses');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState('');

  const totalApproved = useMemo(
    () => (submissions || []).reduce((total, submission) => total + approvedTotal(submission), 0),
    [submissions],
  );

  async function login(event) {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/submissions', { headers: headersFor(password) });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'كلمة المرور غير صحيحة.');
        return;
      }
      setSubmissions(result.data || []);
    } catch {
      setError('تعذر تحميل الإجابات. تحقق من الاتصال ثم حاول مرة أخرى.');
    }
  }

  async function updateSubmission(id, changes, successMessage, actionKey) {
    setNotice('');
    setSaving(actionKey);

    try {
      const response = await fetch('/api/submissions', {
        method: 'PATCH',
        headers: headersFor(password),
        body: JSON.stringify({ id, ...changes }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'تعذر حفظ التغيير.');
      }

      setSubmissions((current) => current.map((submission) => (
        submission.id === id ? { ...submission, ...changes } : submission
      )));
      setNotice(successMessage);
    } catch (updateError) {
      setNotice(updateError.message || 'تعذر حفظ التغيير.');
    } finally {
      setSaving('');
    }
  }

  if (!submissions) {
    return (
      <main className="login">
        <form onSubmit={login}>
          <h1>لوحة المراجعة</h1>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="كلمة المرور"
            required
          />
          <button className="submit">دخول</button>
          {error && <p className="form-error">{error}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="admin" dir="rtl">
      <div className="admin-head">
        <div>
          <p className="eyebrow">Survey Egypt</p>
          <h1>إدارة الاستبيان</h1>
        </div>
        <div className="admin-overall-total">
          <small>إجمالي المبالغ المعتمدة</small>
          <strong>{totalApproved} جنيه</strong>
        </div>
      </div>

      <nav className="admin-tabs" aria-label="أقسام الإدارة">
        <button
          className={tab === 'responses' ? 'active' : ''}
          onClick={() => setTab('responses')}
          type="button"
        >
          الإجابات ({submissions.length})
        </button>
        <button
          className={tab === 'ips' ? 'active' : ''}
          onClick={() => setTab('ips')}
          type="button"
        >
          قيود الوصول
        </button>
      </nav>

      {notice && <p className="admin-notice" role="status">{notice}</p>}

      {tab === 'responses' && (
        <section>
          {submissions.length === 0 && <p className="empty">لا توجد إجابات حتى الآن.</p>}

          {submissions.map((submission) => {
            const total = approvedTotal(submission);
            const isPaid = submission.withdrawal === 'paid';

            return (
              <article className="submission" key={submission.id}>
                <div className="submission-top">
                  <div>
                    <h2>{submission.name || 'بدون اسم'}</h2>
                    <p>{submission.phone || 'بدون رقم'} · {submission.country || 'بدون بلد'}</p>
                  </div>
                  <span className={submission.ip_blocked ? 'ip-status blocked' : 'ip-status unblocked'}>
                    {submission.ip_blocked ? 'الإرسال مقيد' : 'الإرسال مسموح'}
                  </span>
                </div>

                {getAnswerEntries(submission).map(([number, answer]) => {
                  const questionIndex = Number(number) - 1;
                  const decision = submission.decisions?.[number];
                  const actionPrefix = `${submission.id}-${number}`;

                  return (
                    <div className="review" key={number}>
                      <div className="review-copy">
                        <span className="review-number">السؤال {number} · {rewardPerQuestion} جنيه</span>
                        <h3>{surveyQuestions[questionIndex] || `السؤال ${number}`}</h3>
                        <p>{answer}</p>
                      </div>
                      <div className="review-actions" aria-label={`قرار السؤال ${number}`}>
                        <button
                          className={`decision-button approved ${decision === 'approved' ? 'selected' : ''}`}
                          type="button"
                          disabled={saving === `${actionPrefix}-approved`}
                          onClick={() => updateSubmission(
                            submission.id,
                            { decisions: { ...submission.decisions, [number]: 'approved' } },
                            `تم اعتماد السؤال ${number} وإضافة ${rewardPerQuestion} جنيه.`,
                            `${actionPrefix}-approved`,
                          )}
                        >
                          {saving === `${actionPrefix}-approved` ? 'جارٍ الحفظ…' : `مقبولة +${rewardPerQuestion}`}
                        </button>
                        <button
                          className={`decision-button rejected ${decision === 'rejected' ? 'selected' : ''}`}
                          type="button"
                          disabled={saving === `${actionPrefix}-rejected`}
                          onClick={() => updateSubmission(
                            submission.id,
                            { decisions: { ...submission.decisions, [number]: 'rejected' } },
                            `تم رفض السؤال ${number}.`,
                            `${actionPrefix}-rejected`,
                          )}
                        >
                          {saving === `${actionPrefix}-rejected` ? 'جارٍ الحفظ…' : 'مرفوضة'}
                        </button>
                      </div>
                    </div>
                  );
                })}

                <div className="withdraw-admin">
                  <button
                    className={submission.ip_blocked ? 'unlock-ip' : 'block-ip'}
                    type="button"
                    disabled={saving === `${submission.id}-ip`}
                    onClick={() => updateSubmission(
                      submission.id,
                      { ip_blocked: !submission.ip_blocked },
                      submission.ip_blocked ? 'تم السماح بإرسال جديد لهذا المستخدم.' : 'تم تقييد إرسال جديد لهذا المستخدم.',
                      `${submission.id}-ip`,
                    )}
                  >
                    {saving === `${submission.id}-ip`
                      ? 'جارٍ الحفظ…'
                      : submission.ip_blocked ? 'السماح بإرسال جديد' : 'تقييد الإرسال'}
                  </button>

                  <div className="payout-summary">
                    <small>إجمالي المبلغ المستحق</small>
                    <strong>{total} جنيه</strong>
                  </div>

                  <button
                    className={`save ${isPaid ? 'paid' : ''}`}
                    type="button"
                    disabled={total === 0 || isPaid || saving === `${submission.id}-paid`}
                    onClick={() => updateSubmission(
                      submission.id,
                      { withdrawal: 'paid' },
                      `تم تأكيد تحويل ${total} جنيه إلى ${submission.phone || 'رقم المستخدم'}.`,
                      `${submission.id}-paid`,
                    )}
                  >
                    {saving === `${submission.id}-paid`
                      ? 'جارٍ الحفظ…'
                      : isPaid ? 'تم تأكيد التحويل' : 'تأكيد التحويل'}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {tab === 'ips' && (
        <section className="ip-panel">
          <h2>قيود الوصول</h2>
          <p>اختر السماح أو التقييد لكل مستخدم. القيود تطبق على بصمة الاتصال المسجلة عند الإرسال.</p>
          {submissions.length === 0 && <p className="empty">لا توجد اتصالات مسجلة حتى الآن.</p>}

          {submissions.map((submission) => (
            <article className="ip-user" key={submission.id}>
              <div>
                <h3>{submission.name || 'بدون اسم'} — <IpIdentifier submission={submission} /></h3>
                <p>{submission.country || 'بدون بلد'} · {submission.phone || 'بدون رقم'}</p>
              </div>
              <span className={submission.ip_blocked ? 'ip-status blocked' : 'ip-status unblocked'}>
                {submission.ip_blocked ? 'مقيد' : 'مسموح'}
              </span>
              <button
                className={submission.ip_blocked ? 'unlock-ip' : 'block-ip'}
                type="button"
                disabled={saving === `${submission.id}-ip`}
                onClick={() => updateSubmission(
                  submission.id,
                  { ip_blocked: !submission.ip_blocked },
                  submission.ip_blocked ? 'تم السماح للمستخدم بإرسال جديد.' : 'تم تقييد وصول المستخدم.',
                  `${submission.id}-ip`,
                )}
              >
                {saving === `${submission.id}-ip`
                  ? 'جارٍ الحفظ…'
                  : submission.ip_blocked ? 'السماح بالوصول' : 'تقييد الوصول'}
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
