(function () {
  const authBox = document.getElementById('admin-auth');
  const appBox = document.getElementById('admin-app');
  const authMsg = document.getElementById('admin-auth-msg');
  const emailInput = document.getElementById('admin-email');
  const sendLinkBtn = document.getElementById('admin-send-link');
  const refreshBtn = document.getElementById('admin-refresh');
  const logoutBtn = document.getElementById('admin-logout');
  const listEl = document.getElementById('admin-brief-list');
  const detailEl = document.getElementById('admin-brief-detail');

  const cfg = window.DS_SUPABASE_CONFIG || {};
  if (!cfg.url || !cfg.anonKey || !window.supabase) {
    if (authMsg) authMsg.textContent = 'Supabase client configuration is missing.';
    return;
  }

  const supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey);
  let selectedBriefId = '';

  function setAuthMessage(message) {
    if (authMsg) authMsg.textContent = message || '';
  }

  function statusClass(status) {
    const value = String(status || '').toLowerCase();
    if (value === 'sent') return 'sent';
    if (value === 'failed') return 'failed';
    return 'pending';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function toLocalTime(value) {
    if (!value) return '-';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleString();
  }

  async function getAccessToken() {
    const { data } = await supabaseClient.auth.getSession();
    return data && data.session ? data.session.access_token : '';
  }

  async function apiFetch(url, options) {
    const token = await getAccessToken();
    const headers = {
      ...(options && options.headers ? options.headers : {}),
      Authorization: `Bearer ${token}`,
    };
    const response = await fetch(url, { ...(options || {}), headers });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || !body.ok) {
      throw new Error(body.error || `Request failed (${response.status})`);
    }
    return body;
  }

  function showAuthView() {
    if (authBox) authBox.style.display = '';
    if (appBox) appBox.style.display = 'none';
  }

  function showAppView() {
    if (authBox) authBox.style.display = 'none';
    if (appBox) appBox.style.display = '';
  }

  async function renderBriefList() {
    listEl.innerHTML = '<tr><td colspan="4" class="admin-empty">Loading…</td></tr>';
    const body = await apiFetch('/api/admin/briefs?page=1&page_size=50');
    const items = body.items || [];

    if (!items.length) {
      listEl.innerHTML = '<tr><td colspan="4" class="admin-empty">No briefs found.</td></tr>';
      detailEl.innerHTML = '<div class="admin-empty">No brief selected.</div>';
      return;
    }

    listEl.innerHTML = items
      .map((brief) => {
        const id = escapeHtml(brief.brief_id);
        return `
          <tr>
            <td>
              <button class="admin-row-btn" data-brief-id="${id}">
                ${escapeHtml(brief.product_name || id)}
              </button>
            </td>
            <td>${escapeHtml(brief.client_name)}<br><span class="admin-note">${escapeHtml(brief.client_email)}</span></td>
            <td><span class="status-pill ${statusClass(brief.email_status)}">${escapeHtml(brief.email_status)}</span></td>
            <td>${escapeHtml(toLocalTime(brief.submitted_at))}</td>
          </tr>
        `;
      })
      .join('');

    Array.from(document.querySelectorAll('[data-brief-id]')).forEach((button) => {
      button.addEventListener('click', () => loadBriefDetail(button.getAttribute('data-brief-id')));
    });

    const firstId = selectedBriefId || items[0].brief_id;
    if (firstId) await loadBriefDetail(firstId);
  }

  function renderDetailBody(brief) {
    const fields = [
      ['Brief ID', brief.brief_id || brief.id || '-'],
      ['Product', brief.product_name || '-'],
      ['Client', brief.client_name || '-'],
      ['Email', brief.client_email || '-'],
      ['Audience', brief.audience || '-'],
      ['Desired action', brief.desired_action || '-'],
      ['Output type', brief.output_type || '-'],
      ['Value moment', brief.value_moment || '-'],
      ['Build status', brief.build_status || '-'],
      ['Screen count', brief.screen_count || '-'],
      ['Visual style', brief.visual_style || '-'],
      ['Deadline', brief.deadline || '-'],
      ['Urgency', brief.urgency || '-'],
      ['Email status', brief.email_status || '-'],
      ['Submitted', toLocalTime(brief.created_at || brief.submitted_at)],
    ];

    const kv = fields
      .map(([key, value]) => `<div class="k">${escapeHtml(key)}</div><div>${escapeHtml(value)}</div>`)
      .join('');

    const attachmentLinks = (brief.attachment_downloads || [])
      .map((file, index) => {
        if (!file.signed_url) return '';
        return `<a href="${escapeHtml(file.signed_url)}" target="_blank" rel="noopener">Attachment ${index + 1} — ${escapeHtml(file.original_name || 'download')}</a>`;
      })
      .join('');

    const pdfLink = brief.summary_pdf_url
      ? `<a href="${escapeHtml(brief.summary_pdf_url)}" target="_blank" rel="noopener">Download PDF Summary</a>`
      : '';

    detailEl.innerHTML = `
      <div class="admin-kv">${kv}</div>
      <h4 style="margin:16px 0 8px;">Extra Notes</h4>
      <p class="admin-pre">${escapeHtml(brief.extra_notes || '-')}</p>
      <h4 style="margin:16px 0 8px;">Assets</h4>
      <div class="admin-links">${pdfLink}${attachmentLinks || '<span class="admin-empty">No attachments.</span>'}</div>
      <div style="margin-top:16px;">
        <button class="admin-btn" id="admin-resend">Resend email</button>
      </div>
    `;

    const resendBtn = document.getElementById('admin-resend');
    if (resendBtn) {
      resendBtn.addEventListener('click', async () => {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Resending…';
        try {
          await apiFetch(`/api/admin/briefs/${encodeURIComponent(brief.brief_id || brief.id)}/resend-email`, {
            method: 'POST',
          });
          await renderBriefList();
        } catch (error) {
          alert(error.message || 'Resend failed');
        } finally {
          resendBtn.disabled = false;
          resendBtn.textContent = 'Resend email';
        }
      });
    }
  }

  async function loadBriefDetail(briefId) {
    selectedBriefId = briefId;
    detailEl.innerHTML = '<div class="admin-empty">Loading detail…</div>';
    try {
      const body = await apiFetch(`/api/admin/briefs/${encodeURIComponent(briefId)}`);
      renderDetailBody(body.brief || {});
    } catch (error) {
      detailEl.innerHTML = `<div class="admin-empty">${escapeHtml(error.message || 'Unable to load detail')}</div>`;
    }
  }

  async function initSession() {
    const { data } = await supabaseClient.auth.getSession();
    if (!data || !data.session) {
      showAuthView();
      return;
    }
    showAppView();
    await renderBriefList();
  }

  if (sendLinkBtn) {
    sendLinkBtn.addEventListener('click', async () => {
      const email = (emailInput && emailInput.value ? emailInput.value.trim() : '').toLowerCase();
      if (!email || !email.includes('@')) {
        setAuthMessage('Please enter a valid email.');
        return;
      }
      sendLinkBtn.disabled = true;
      setAuthMessage('Sending magic link…');
      try {
        const { error } = await supabaseClient.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/briefs`,
          },
        });
        if (error) throw error;
        setAuthMessage('Magic link sent. Open your email inbox and click the sign-in link.');
      } catch (error) {
        setAuthMessage(error.message || 'Could not send magic link.');
      } finally {
        sendLinkBtn.disabled = false;
      }
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      await renderBriefList();
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await supabaseClient.auth.signOut();
      showAuthView();
      setAuthMessage('');
      if (listEl) listEl.innerHTML = '';
      if (detailEl) detailEl.innerHTML = '<div class="admin-empty">Select a brief to view full details.</div>';
    });
  }

  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    if (session) {
      showAppView();
      await renderBriefList();
    } else {
      showAuthView();
    }
  });

  initSession().catch((error) => {
    setAuthMessage(error.message || 'Could not initialize admin session.');
    showAuthView();
  });
})();

