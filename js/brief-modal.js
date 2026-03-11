// ─────────────────────────────────────────────
//  DEMO SPRINT · Brief Modal
//  Drop <div id="ds-brief-modal"></div> anywhere
//  Call openBriefModal() from any CTA button
// ─────────────────────────────────────────────

(function () {
  // ── INJECT MODAL HTML ──────────────────────
  const MODAL_HTML = `
<div class="ds-modal-overlay" id="dsBriefOverlay">
  <div class="ds-modal" role="dialog" aria-modal="true" aria-label="Demo Sprint Brief">

    <div class="ds-modal-header">
      <div class="ds-modal-title">Demo Sprint · Client Brief</div>
      <button class="ds-modal-close" onclick="closeBriefModal()" aria-label="Close">✕</button>
    </div>

    <div class="ds-modal-body">
      <div class="ds-modal-progress">
        <div class="ds-modal-progress-fill" id="dsProgressFill" style="width:0%"></div>
      </div>

      <!-- ── STEP 1: PRODUCT ── -->
      <div class="ms-step active" id="ms-step-1">
        <div class="ms-num">01 of 06 · Your Product</div>
        <h2 class="ms-title">What are you <em>building?</em></h2>
        <p class="ms-sub">Tell me about the product — not the tech, the thing it does for someone.</p>

        <div class="ms-field">
          <label class="ms-label">Product name <span class="req">*</span></label>
          <input class="ms-input" id="ms-product-name" placeholder="e.g. TechFlow, InboundIQ" maxlength="60">
          <div class="ms-field-err" id="err-product-name">Please enter your product name.</div>
        </div>
        <div class="ms-field">
          <label class="ms-label">What does it do? <span class="req">*</span>
            <span class="hint">One or two plain sentences — no jargon.</span>
          </label>
          <textarea class="ms-textarea" id="ms-product-desc" placeholder="e.g. A platform where construction companies post jobs and verified tradespeople apply." maxlength="300"></textarea>
          <div class="ms-counter" id="cc-desc">0 / 300</div>
          <div class="ms-field-err" id="err-product-desc">Please describe what your product does.</div>
        </div>
        <div class="ms-field">
          <label class="ms-label">Who is the end user? <span class="req">*</span></label>
          <input class="ms-input" id="ms-end-user" placeholder="e.g. Solo founders, restaurant owners" maxlength="120">
          <div class="ms-field-err" id="err-end-user">Please describe your end user.</div>
        </div>

        <div class="ms-nav">
          <span></span>
          <button class="ms-next" onclick="msNext(1)">Next</button>
        </div>
      </div>

      <!-- ── STEP 2: DEMO PURPOSE ── -->
      <div class="ms-step" id="ms-step-2">
        <div class="ms-num">02 of 06 · Demo Purpose</div>
        <h2 class="ms-title">Who sees this — and what should they <em>do?</em></h2>
        <p class="ms-sub">The demo's job is to trigger one specific action from one specific person.</p>

        <div class="ms-field">
          <label class="ms-label">Demo audience <span class="req">*</span></label>
          <div class="ms-options cols2">
            <div class="ms-option" onclick="msOption(this,'audience','investor')"><div class="ms-option-title">💼 Investors / VCs</div><div class="ms-option-desc">Pitch meetings, angel rounds</div></div>
            <div class="ms-option" onclick="msOption(this,'audience','users')"><div class="ms-option-title">👥 Early Users</div><div class="ms-option-desc">User testing, waitlist signups</div></div>
            <div class="ms-option" onclick="msOption(this,'audience','sales')"><div class="ms-option-title">📈 Sales Leads</div><div class="ms-option-desc">B2B outreach, pre-call demos</div></div>
            <div class="ms-option" onclick="msOption(this,'audience','internal')"><div class="ms-option-title">🏗 Internal Team</div><div class="ms-option-desc">Stakeholder alignment, dev handoff</div></div>
            <div class="ms-option" onclick="msOption(this,'audience','accelerator')"><div class="ms-option-title">🚀 Accelerator / Demo Day</div><div class="ms-option-desc">YC, Techstars, demo day deadline</div></div>
            <div class="ms-option" onclick="msOption(this,'audience','other')"><div class="ms-option-title">✦ Other</div><div class="ms-option-desc">Press, partnerships, conferences</div></div>
          </div>
          <input type="hidden" id="ms-audience">
          <div class="ms-field-err" id="err-audience">Please select a demo audience.</div>
        </div>
        <div class="ms-field">
          <label class="ms-label">What action should the viewer take? <span class="req">*</span></label>
          <input class="ms-input" id="ms-action" placeholder='e.g. "Book a meeting", "Sign up", "Say yes to funding"' maxlength="140">
          <div class="ms-field-err" id="err-action">Please describe the desired action.</div>
        </div>

        <div class="ms-nav">
          <button class="ms-back" onclick="msPrev(2)">Back</button>
          <button class="ms-next" onclick="msNext(2)">Next</button>
        </div>
      </div>

      <!-- ── STEP 3: VALUE MOMENT ── -->
      <div class="ms-step" id="ms-step-3">
        <div class="ms-num">03 of 06 · The Value Moment</div>
        <h2 class="ms-title">What does your product <em>output?</em></h2>
        <p class="ms-sub">Not what it does — what it <em>produces</em> that makes someone say "I need this."</p>

        <div class="ms-field">
          <label class="ms-label">Output type <span class="req">*</span></label>
          <div class="ms-options cols2">
            <div class="ms-option" onclick="msOption(this,'output','report')"><div class="ms-option-title">📊 Report / Audit</div><div class="ms-option-desc">Scores, findings, diagnostics</div></div>
            <div class="ms-option" onclick="msOption(this,'output','dashboard')"><div class="ms-option-title">📉 Dashboard</div><div class="ms-option-desc">Charts, metrics, KPIs</div></div>
            <div class="ms-option" onclick="msOption(this,'output','match')"><div class="ms-option-title">🔗 Match / Discovery</div><div class="ms-option-desc">Marketplace, recommendations</div></div>
            <div class="ms-option" onclick="msOption(this,'output','roadmap')"><div class="ms-option-title">🗺 Roadmap / Plan</div><div class="ms-option-desc">Action plans, strategy outputs</div></div>
            <div class="ms-option" onclick="msOption(this,'output','tool')"><div class="ms-option-title">⚙ Interactive Tool</div><div class="ms-option-desc">Calculator, configurator</div></div>
            <div class="ms-option" onclick="msOption(this,'output','flow')"><div class="ms-option-title">➡ User Flow</div><div class="ms-option-desc">Onboarding, booking sequence</div></div>
            <div class="ms-option" onclick="msOption(this,'output','crm')"><div class="ms-option-title">📋 Management View</div><div class="ms-option-desc">Pipeline, CRM, task manager</div></div>
            <div class="ms-option" onclick="msOption(this,'output','other')"><div class="ms-option-title">✦ Something else</div><div class="ms-option-desc">Describe below</div></div>
          </div>
          <input type="hidden" id="ms-output">
          <div class="ms-field-err" id="err-output">Please select an output type.</div>
        </div>
        <div class="ms-field">
          <label class="ms-label">The single most important screen <span class="req">*</span>
            <span class="hint">Where does someone go "I get it — I want this"?</span>
          </label>
          <textarea class="ms-textarea" id="ms-value-moment" placeholder="e.g. The results page after entering a URL — shows a score, 4 phases, prioritised fixes. That's the moment they realise they need this." maxlength="400"></textarea>
          <div class="ms-counter" id="cc-moment">0 / 400</div>
          <div class="ms-field-err" id="err-value-moment">Please describe your value moment.</div>
        </div>

        <div class="ms-insight" id="ms-insight">
          <div class="ms-insight-label">⚡ Auto-detected · Your Demo Sprint Focus</div>
          <div class="ms-insight-text" id="ms-insight-text"></div>
        </div>

        <div class="ms-nav">
          <button class="ms-back" onclick="msPrev(3)">Back</button>
          <button class="ms-next" onclick="msNext(3)">Next</button>
        </div>
      </div>

      <!-- ── STEP 4: SCOPE ── -->
      <div class="ms-step" id="ms-step-4">
        <div class="ms-num">04 of 06 · Scope</div>
        <h2 class="ms-title">How much <em>exists</em> already?</h2>
        <p class="ms-sub">This tells me what I'm working with — proof of concept or polishing something real.</p>

        <div class="ms-field">
          <label class="ms-label">Current build status <span class="req">*</span></label>
          <div class="ms-options">
            <div class="ms-option" onclick="msOption(this,'status','idea')"><div class="ms-option-title">💡 Just an idea — nothing built</div><div class="ms-option-desc">I'll build entirely from your brief</div></div>
            <div class="ms-option" onclick="msOption(this,'status','partial')"><div class="ms-option-title">🔧 Partially built</div><div class="ms-option-desc">I'll extend or polish the output layer</div></div>
            <div class="ms-option" onclick="msOption(this,'status','backend')"><div class="ms-option-title">⚙ Backend exists, no polished frontend</div><div class="ms-option-desc">I'll build a professional UI layer</div></div>
            <div class="ms-option" onclick="msOption(this,'status','built')"><div class="ms-option-title">✅ Fully built — needs a better demo</div><div class="ms-option-desc">I'll create a focused demo experience</div></div>
          </div>
          <input type="hidden" id="ms-status">
          <div class="ms-field-err" id="err-status">Please select your build status.</div>
        </div>
        <div class="ms-field">
          <label class="ms-label">Screens to cover <span class="req">*</span></label>
          <div class="ms-pills">
            <div class="ms-pill" onclick="msPill(this,'screens','1-3')">1–3 screens</div>
            <div class="ms-pill" onclick="msPill(this,'screens','4-6')">4–6 screens</div>
            <div class="ms-pill" onclick="msPill(this,'screens','7-10')">7–10 screens</div>
            <div class="ms-pill" onclick="msPill(this,'screens','unsure')">Your call</div>
          </div>
          <input type="hidden" id="ms-screens">
          <div class="ms-field-err" id="err-screens">Please select a screen count.</div>
        </div>
        <div class="ms-field">
          <label class="ms-label">Seed data (optional)
            <span class="hint">Real domain, names, metrics — makes the demo feel authentic.</span>
          </label>
          <textarea class="ms-textarea" id="ms-seed-data" placeholder="e.g. Domain: techflow.io · Show 3 users: James, Sarah, Priya · Brand color: #f59e0b" maxlength="400" style="min-height:70px"></textarea>
        </div>

        <div class="ms-nav">
          <button class="ms-back" onclick="msPrev(4)">Back</button>
          <button class="ms-next" onclick="msNext(4)">Next</button>
        </div>
      </div>

      <!-- ── STEP 5: REFERENCES ── -->
      <div class="ms-step" id="ms-step-5">
        <div class="ms-num">05 of 06 · References & Brand</div>
        <h2 class="ms-title">What should it <em>look like?</em></h2>
        <p class="ms-sub">This separates a generic demo from something that looks like a $500/hr team built it.</p>

        <div class="ms-field">
          <label class="ms-label">Design references (optional)
            <span class="hint">Products whose UI you admire — competitors, tools, anything.</span>
          </label>
          <input class="ms-input" id="ms-references" placeholder="e.g. Linear, Stripe, Notion, Figma, Vercel dashboard" maxlength="200">
        </div>
        <div class="ms-field">
          <label class="ms-label">Visual style <span class="req">*</span></label>
          <div class="ms-pills">
            <div class="ms-pill" onclick="msPill(this,'style','dark')">Dark / technical</div>
            <div class="ms-pill" onclick="msPill(this,'style','light')">Light / clean</div>
            <div class="ms-pill" onclick="msPill(this,'style','bold')">Bold / editorial</div>
            <div class="ms-pill" onclick="msPill(this,'style','minimal')">Minimal</div>
            <div class="ms-pill" onclick="msPill(this,'style','warm')">Warm / premium</div>
            <div class="ms-pill" onclick="msPill(this,'style','match')">Match my brand</div>
          </div>
          <input type="hidden" id="ms-style">
          <div class="ms-field-err" id="err-style">Please select a visual style.</div>
        </div>
        <div class="ms-field">
          <label class="ms-label">Brand colours (optional)</label>
          <input class="ms-input" id="ms-colors" placeholder="e.g. #1a1a2e and #f59e0b — or 'dark green and white, premium feel'" maxlength="150">
        </div>
        <div class="ms-field">
          <label class="ms-label">Links — Figma, live site, inspiration (optional)</label>
          <textarea class="ms-textarea" id="ms-links" placeholder="https://yoursite.com&#10;https://figma.com/your-file" maxlength="400" style="min-height:70px"></textarea>
        </div>
        <div class="ms-field">
          <label class="ms-label">Attach files (optional)
            <span class="hint">Up to 3 files (PDF, PNG, JPG, WEBP), max 10MB each.</span>
          </label>
          <input class="ms-file-input" type="file" id="ms-attachments" multiple accept=".pdf,image/png,image/jpeg,image/webp">
          <div class="ms-file-list" id="ms-file-list"></div>
          <div class="ms-field-err" id="err-attachments">File validation failed.</div>
        </div>

        <div class="ms-nav">
          <button class="ms-back" onclick="msPrev(5)">Back</button>
          <button class="ms-next" onclick="msNext(5)">Next</button>
        </div>
      </div>

      <!-- ── STEP 6: TIMELINE & CONTACT ── -->
      <div class="ms-step" id="ms-step-6">
        <div class="ms-num">06 of 06 · Timeline & Contact</div>
        <h2 class="ms-title">When do you <em>need it?</em></h2>
        <p class="ms-sub">I deliver within 72 hours of a complete brief. Tell me your deadline.</p>

        <div class="ms-field">
          <label class="ms-label">Deadline <span class="req">*</span></label>
          <div class="ms-options cols2">
            <div class="ms-option" onclick="msOption(this,'deadline','asap')"><div class="ms-option-title">🔥 ASAP — within 3 days</div></div>
            <div class="ms-option" onclick="msOption(this,'deadline','week')"><div class="ms-option-title">📅 This week</div></div>
            <div class="ms-option" onclick="msOption(this,'deadline','twoweeks')"><div class="ms-option-title">🗓 Within 2 weeks</div></div>
            <div class="ms-option" onclick="msOption(this,'deadline','flexible')"><div class="ms-option-title">✦ Flexible</div></div>
          </div>
          <input type="hidden" id="ms-deadline">
          <div class="ms-field-err" id="err-deadline">Please select a deadline.</div>
        </div>
        <div class="ms-field">
          <label class="ms-label">What's driving the deadline? (optional)</label>
          <input class="ms-input" id="ms-urgency" placeholder="e.g. Investor meeting March 22, YC application March 25" maxlength="150">
        </div>

        <div class="ms-divider"></div>

        <div class="ms-field">
          <label class="ms-label">Your name <span class="req">*</span></label>
          <input class="ms-input" id="ms-name" placeholder="First name is fine" maxlength="80">
          <div class="ms-field-err" id="err-name">Please enter your name.</div>
        </div>
        <div class="ms-field">
          <label class="ms-label">Your email <span class="req">*</span>
            <span class="hint">Where I'll send the demo link.</span>
          </label>
          <input class="ms-input" type="email" id="ms-email" placeholder="you@yourcompany.com" maxlength="120">
          <div class="ms-field-err" id="err-email">Please enter a valid email address.</div>
        </div>
        <div class="ms-field">
          <label class="ms-label">Anything else? (optional)</label>
          <textarea class="ms-textarea" id="ms-extra" placeholder="Constraints, sensitivities, context that doesn't fit above." maxlength="400" style="min-height:70px"></textarea>
        </div>

        <div class="ms-nav">
          <button class="ms-back" onclick="msPrev(6)">Back</button>
          <button class="ms-submit" id="ms-submit-btn" onclick="msSubmit()">Send Brief</button>
        </div>
      </div>

      <!-- ── SUCCESS ── -->
      <div class="ms-success" id="ms-success">
        <div class="ms-success-icon">✓</div>
        <h2 class="ms-success-title">Brief received.</h2>
        <p class="ms-success-sub" id="ms-success-sub">I'll review your brief and confirm the demo scope within 4 hours. Your live link will be in your inbox in 72 hours.</p>
        <div class="ms-success-detail">
          <div class="ms-success-row"><span class="ms-success-icon2">📋</span><span class="ms-success-text">Brief submitted for <strong id="ms-suc-name">your product</strong></span></div>
          <div class="ms-success-row"><span class="ms-success-icon2">⚡</span><span class="ms-success-text">Demo focus: <strong id="ms-suc-focus">identified</strong></span></div>
          <div class="ms-success-row"><span class="ms-success-icon2">📬</span><span class="ms-success-text">Confirmation to <strong id="ms-suc-email">your email</strong></span></div>
          <div class="ms-success-row"><span class="ms-success-icon2">🛡</span><span class="ms-success-text"><strong>You review the demo before any payment.</strong></span></div>
        </div>
      </div>

    </div><!-- /modal-body -->
  </div><!-- /modal -->
</div><!-- /overlay -->
`;

  // ── INJECT ON DOM READY ───────────────────
  function init() {
    const container = document.getElementById('ds-brief-modal');
    if (container) container.innerHTML = MODAL_HTML;

    // Char counters
    const descEl = document.getElementById('ms-product-desc');
    const momEl  = document.getElementById('ms-value-moment');
    if (descEl) descEl.addEventListener('input', function() {
      const cc = document.getElementById('cc-desc');
      if (cc) { cc.textContent = this.value.length + ' / 300'; cc.className = 'ms-counter' + (this.value.length > 250 ? ' warn' : ''); }
    });
    if (momEl) momEl.addEventListener('input', function() {
      const cc = document.getElementById('cc-moment');
      if (cc) { cc.textContent = this.value.length + ' / 400'; cc.className = 'ms-counter' + (this.value.length > 350 ? ' warn' : ''); }
      msUpdateInsight();
    });
    const attachmentsEl = document.getElementById('ms-attachments');
    if (attachmentsEl) attachmentsEl.addEventListener('change', msHandleAttachmentInput);

    // Close on overlay click
    const overlay = document.getElementById('dsBriefOverlay');
    if (overlay) overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeBriefModal();
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeBriefModal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ── STATE ─────────────────────────────────────
let msCurrentStep = 1;
const msTotalSteps = 6;
const msData = {};
let msAttachmentFiles = [];
const msAttachmentRule = {
  maxFiles: 3,
  maxSize: 10 * 1024 * 1024,
  allowedTypes: new Set(['application/pdf', 'image/png', 'image/jpeg', 'image/webp']),
};
const msDefaultSuccessSub = "I'll review your brief and confirm the demo scope within 4 hours. Your live link will be in your inbox in 72 hours.";

const msInsightMap = {
  report:    { focus: 'the final audit/diagnostic report screen',     detail: 'I\'ll build the <strong>results output page</strong> — scores, findings, evidence, and recommendations — with realistic pre-seeded data.' },
  dashboard: { focus: 'the main analytics dashboard view',            detail: 'I\'ll build the <strong>core dashboard</strong> — charts, metrics, KPIs — using realistic mock data.' },
  match:     { focus: 'the discovery/match results screen',           detail: 'I\'ll build the <strong>match results listing</strong> — matched items with filters and a clear next action.' },
  roadmap:   { focus: 'the prioritised roadmap output',               detail: 'I\'ll build the <strong>roadmap screen</strong> — prioritised recommendations with impact ratings and next steps.' },
  tool:      { focus: 'the personalised result of the tool',          detail: 'I\'ll build the <strong>result screen</strong> — what someone sees after using your calculator or generator.' },
  flow:      { focus: 'the core user flow — key steps in sequence',   detail: 'I\'ll build the <strong>primary user journey</strong> — from trigger through to completion — as a click-through prototype.' },
  crm:       { focus: 'the main management / pipeline view',          detail: 'I\'ll build the <strong>core management screen</strong> — pipeline, records, actions — pre-seeded with representative data.' },
  other:     { focus: 'your core value output (from your description)',detail: 'Based on your value moment description, I\'ll identify the right output and confirm before starting.' },
};

// ── OPEN / CLOSE ──────────────────────────────
function openBriefModal() {
  const overlay = document.getElementById('dsBriefOverlay');
  if (!overlay) return;
  msResetFormState();
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  msCurrentStep = 1;
  msShowStep(1);
  msUpdateProgress();
}

function closeBriefModal() {
  const overlay = document.getElementById('dsBriefOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function msResetFormState() {
  Object.keys(msData).forEach((key) => delete msData[key]);
  msAttachmentFiles = [];

  document.querySelectorAll('#dsBriefOverlay .ms-step input, #dsBriefOverlay .ms-step textarea').forEach((el) => {
    if (el.type === 'hidden' || el.type === 'text' || el.type === 'email' || el.type === 'file' || el.tagName === 'TEXTAREA') {
      el.value = '';
    }
  });

  document.querySelectorAll('#dsBriefOverlay .ms-option.sel, #dsBriefOverlay .ms-pill.sel').forEach((el) => {
    el.classList.remove('sel');
  });
  document.querySelectorAll('#dsBriefOverlay .ms-field-err.show').forEach((el) => {
    el.classList.remove('show');
  });
  document.querySelectorAll('#dsBriefOverlay .ms-input.error').forEach((el) => {
    el.classList.remove('error');
  });

  const descCounter = document.getElementById('cc-desc');
  const momentCounter = document.getElementById('cc-moment');
  if (descCounter) descCounter.textContent = '0 / 300';
  if (momentCounter) momentCounter.textContent = '0 / 400';

  const insight = document.getElementById('ms-insight');
  if (insight) insight.classList.remove('show');

  const success = document.getElementById('ms-success');
  if (success) success.classList.remove('show');
  const successSub = document.getElementById('ms-success-sub');
  if (successSub) successSub.textContent = msDefaultSuccessSub;

  const submitBtn = document.getElementById('ms-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Brief';
  }

  msSetAttachmentError('');
  msRenderAttachmentList();
}

// ── STEP NAVIGATION ───────────────────────────
function msShowStep(n) {
  for (let i = 1; i <= msTotalSteps; i++) {
    const el = document.getElementById('ms-step-' + i);
    if (el) el.classList.toggle('active', i === n);
  }
  const modal = document.querySelector('.ds-modal');
  if (modal) modal.scrollTop = 0;
}

function msUpdateProgress() {
  const fill = document.getElementById('dsProgressFill');
  if (fill) fill.style.width = (((msCurrentStep - 1) / msTotalSteps) * 100) + '%';
}

function msNext(from) {
  if (!msValidate(from)) return;
  msCollect(from);
  msCurrentStep = from + 1;
  if (msCurrentStep > msTotalSteps) return;
  msShowStep(msCurrentStep);
  msUpdateProgress();
}

function msPrev(from) {
  msCurrentStep = from - 1;
  msShowStep(msCurrentStep);
  msUpdateProgress();
}

// ── VALIDATION ────────────────────────────────
function msValidate(step) {
  let ok = true;

  function req(id, errId) {
    const el = document.getElementById(id);
    const err = document.getElementById(errId);
    if (!el || !el.value.trim()) {
      if (err) err.classList.add('show');
      if (el) { el.classList.add('error'); el.addEventListener('input', () => { el.classList.remove('error'); err && err.classList.remove('show'); }, { once: true }); }
      if (ok) { ok = false; el && el.focus(); }
    }
  }

  function reqHidden(id, errId) {
    const el = document.getElementById(id);
    const err = document.getElementById(errId);
    if (!el || !el.value.trim()) {
      if (err) err.classList.add('show');
      if (ok) ok = false;
      if (el) el.addEventListener('change', () => err && err.classList.remove('show'), { once: true });
    }
  }

  if (step === 1) { req('ms-product-name','err-product-name'); req('ms-product-desc','err-product-desc'); req('ms-end-user','err-end-user'); }
  if (step === 2) { reqHidden('ms-audience','err-audience'); req('ms-action','err-action'); }
  if (step === 3) { reqHidden('ms-output','err-output'); req('ms-value-moment','err-value-moment'); }
  if (step === 4) { reqHidden('ms-status','err-status'); reqHidden('ms-screens','err-screens'); }
  if (step === 5) { reqHidden('ms-style','err-style'); }
  if (step === 6) {
    reqHidden('ms-deadline','err-deadline');
    req('ms-name','err-name');
    const emailEl = document.getElementById('ms-email');
    const emailErr = document.getElementById('err-email');
    if (!emailEl || !emailEl.value.trim() || !emailEl.value.includes('@')) {
      if (emailErr) emailErr.classList.add('show');
      if (ok) { ok = false; emailEl && emailEl.focus(); }
      if (emailEl) emailEl.addEventListener('input', () => emailErr && emailErr.classList.remove('show'), { once: true });
    }
  }

  return ok;
}

// ── COLLECT DATA ──────────────────────────────
function msCollect(step) {
  const ids = {
    1: ['ms-product-name','ms-product-desc','ms-end-user'],
    2: ['ms-audience','ms-action'],
    3: ['ms-output','ms-value-moment'],
    4: ['ms-status','ms-screens','ms-seed-data'],
    5: ['ms-references','ms-style','ms-colors','ms-links'],
    6: ['ms-deadline','ms-urgency','ms-name','ms-email','ms-extra'],
  };
  (ids[step] || []).forEach(id => {
    const el = document.getElementById(id);
    if (el) msData[id] = el.value.trim();
  });
}

function msSetAttachmentError(message) {
  const err = document.getElementById('err-attachments');
  if (!err) return;
  if (!message) {
    err.classList.remove('show');
    err.textContent = 'File validation failed.';
    return;
  }
  err.textContent = message;
  err.classList.add('show');
}

function msHandleAttachmentInput(event) {
  const input = event.target;
  const files = Array.from(input.files || []);
  if (!files.length) return;

  msSetAttachmentError('');
  const next = [...msAttachmentFiles];
  for (const file of files) {
    if (next.length >= msAttachmentRule.maxFiles) {
      msSetAttachmentError(`You can upload up to ${msAttachmentRule.maxFiles} files.`);
      break;
    }
    if (!msAttachmentRule.allowedTypes.has(file.type)) {
      msSetAttachmentError(`Unsupported file type: ${file.type || 'unknown'}.`);
      continue;
    }
    if (file.size > msAttachmentRule.maxSize) {
      msSetAttachmentError(`${file.name} exceeds the 10MB limit.`);
      continue;
    }
    next.push(file);
  }

  msAttachmentFiles = next;
  input.value = '';
  msRenderAttachmentList();
}

function msRenderAttachmentList() {
  const list = document.getElementById('ms-file-list');
  if (!list) return;
  if (!msAttachmentFiles.length) {
    list.innerHTML = '<div class="ms-file-empty">No files attached.</div>';
    return;
  }

  list.innerHTML = msAttachmentFiles
    .map((file, index) => {
      const sizeText = `${Math.max(1, Math.round(file.size / 1024))} KB`;
      return `
        <div class="ms-file-item">
          <span class="ms-file-name">${file.name}</span>
          <span class="ms-file-size">${sizeText}</span>
          <button type="button" class="ms-file-remove" onclick="msRemoveAttachment(${index})">Remove</button>
        </div>
      `;
    })
    .join('');
}

function msRemoveAttachment(index) {
  msAttachmentFiles = msAttachmentFiles.filter((_, i) => i !== index);
  msRenderAttachmentList();
}

function msBuildPayload() {
  return {
    product_name: msData['ms-product-name'] || '',
    product_desc: msData['ms-product-desc'] || '',
    end_user: msData['ms-end-user'] || '',
    audience: msData['ms-audience'] || '',
    desired_action: msData['ms-action'] || '',
    output_type: msData['ms-output'] || '',
    value_moment: msData['ms-value-moment'] || '',
    build_status: msData['ms-status'] || '',
    screen_count: msData['ms-screens'] || '',
    seed_data: msData['ms-seed-data'] || '',
    references: msData['ms-references'] || '',
    visual_style: msData['ms-style'] || '',
    brand_colors: msData['ms-colors'] || '',
    links: msData['ms-links'] || '',
    deadline: msData['ms-deadline'] || '',
    urgency: msData['ms-urgency'] || '',
    client_name: msData['ms-name'] || '',
    client_email: msData['ms-email'] || '',
    extra_notes: msData['ms-extra'] || '',
    source_page: window.location.pathname,
  };
}

function msShowSuccess(result) {
  for (let i = 1; i <= msTotalSteps; i++) {
    const el = document.getElementById('ms-step-' + i);
    if (el) el.classList.remove('active');
  }

  const suc = document.getElementById('ms-success');
  if (suc) suc.classList.add('show');

  const fill = document.getElementById('dsProgressFill');
  if (fill) fill.style.width = '100%';

  const outputVal = msData['ms-output'] || 'other';
  const insight = msInsightMap[outputVal] || msInsightMap.other;
  const sucName = document.getElementById('ms-suc-name');
  const sucFocus = document.getElementById('ms-suc-focus');
  const sucEmail = document.getElementById('ms-suc-email');
  if (sucName) sucName.textContent = msData['ms-product-name'] || 'your product';
  if (sucFocus) sucFocus.textContent = insight.focus;
  if (sucEmail) sucEmail.textContent = msData['ms-email'] || 'your email';

  const successSub = document.getElementById('ms-success-sub');
  if (successSub && result && result.email_status === 'failed') {
    successSub.textContent = 'Brief received and saved. Email delivery failed this time, but your submission is recorded.';
  }

  const modal = document.querySelector('.ds-modal');
  if (modal) modal.scrollTop = 0;
}

// ── OPTION / PILL SELECTION ───────────────────
function msOption(card, group, value) {
  card.closest('.ms-options').querySelectorAll('.ms-option').forEach(c => c.classList.remove('sel'));
  card.classList.add('sel');
  const inp = document.getElementById('ms-' + group);
  if (inp) { inp.value = value; inp.dispatchEvent(new Event('change')); }
  if (group === 'output') msUpdateInsight();
}

function msPill(pill, group, value) {
  pill.closest('.ms-pills').querySelectorAll('.ms-pill').forEach(p => p.classList.remove('sel'));
  pill.classList.add('sel');
  const inp = document.getElementById('ms-' + group);
  if (inp) { inp.value = value; inp.dispatchEvent(new Event('change')); }
}

// ── INSIGHT DETECTION ─────────────────────────
function msUpdateInsight() {
  const outputVal = (document.getElementById('ms-output') || {}).value || '';
  const momentVal = ((document.getElementById('ms-value-moment') || {}).value || '').trim();
  const box  = document.getElementById('ms-insight');
  const text = document.getElementById('ms-insight-text');
  if (outputVal && momentVal.length > 20) {
    const ins = msInsightMap[outputVal] || msInsightMap.other;
    if (box)  box.classList.add('show');
    if (text) text.innerHTML = `Your Demo Sprint will focus on <strong>${ins.focus}</strong>. ${ins.detail}`;
  } else {
    if (box) box.classList.remove('show');
  }
}

// ── SUBMIT ────────────────────────────────────
async function msSubmit() {
  if (!msValidate(6)) return;
  for (let step = 1; step <= msTotalSteps; step += 1) msCollect(step);

  const btn = document.getElementById('ms-submit-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

  try {
    const payload = msBuildPayload();
    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));
    msAttachmentFiles.forEach((file) => formData.append('attachments', file, file.name));

    const response = await fetch('/api/briefs/submit', {
      method: 'POST',
      body: formData,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      throw new Error(result.error || 'Submission failed');
    }

    msShowSuccess(result);
  } catch (error) {
    console.error('Brief submit failed:', error);
    msSetAttachmentError(error.message || 'Unable to submit brief right now.');
    alert(error.message || 'Unable to submit brief right now.');
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Send Brief';
    }
  }
}
