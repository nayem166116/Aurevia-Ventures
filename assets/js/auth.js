(() => {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const $ = (s) => document.querySelector(s);
  const emailKey = 'aurevia-verification-email';
  if (path === '/login') {
    const form = $('#login-form'); const error = $('#login-error'); const button = $('#login-submit');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      button.disabled = true; button.textContent = 'Signing in…'; error.textContent = '';
      setTimeout(() => { button.disabled = false; button.textContent = 'Sign in'; error.textContent = 'We couldn’t find an account with those details.'; }, 1100);
    });
  }
  if (path === '/register') {
    const form = $('#register-form'); const pass = $('#password'); const confirm = $('#confirm-password'); const email = $('#email'); const submit = $('#register-submit');
    const fields = [...form.querySelectorAll('input')];
    const errors = { name: $('#name-error'), email: $('#email-error'), password: $('#password-error'), confirm: $('#confirm-error'), terms: $('#terms-error') };
    const validEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    const check = (input, show=true) => {
      const value = input.value.trim(); let message = '';
      if (input.id === 'full-name' && (value.length < 2 || /^\d+$/.test(value))) message = 'Enter your full name';
      if (input.id === 'email' && !validEmail(value)) message = 'Enter a valid email address';
      if (input.id === 'password') { if (value.length < 8) message = 'Password must be at least 8 characters'; else if (!/[A-Z]/.test(value)) message = 'Include at least one uppercase letter'; else if (!/\d/.test(value)) message = 'Include at least one number'; }
      if (input.id === 'confirm-password' && value !== pass.value) message = 'Passwords don’t match';
      const map = { 'full-name': errors.name, email: errors.email, password: errors.password, 'confirm-password': errors.confirm };
      if (show && map[input.id]) map[input.id].textContent = message;
      return !message;
    };
    const refresh = () => {
      const all = check($('#full-name'), false) && check(email, false) && check(pass, false) && check(confirm, false) && $('#terms').checked;
      submit.disabled = !all;
      ['length','upper','number'].forEach(k => { const el = document.querySelector(`[data-check="${k}"]`); const ok = k==='length' ? pass.value.length>=8 : k==='upper' ? /[A-Z]/.test(pass.value) : /\d/.test(pass.value); el?.classList.toggle('is-valid', ok); if (el) el.textContent = `${ok ? '✓' : '○'} ${el.dataset.label}`; });
      const score = [pass.value.length>=8, /[A-Z]/.test(pass.value), /\d/.test(pass.value)].filter(Boolean).length;
      const meter = $('#strength'); if (meter) meter.textContent = pass.value ? (score===3 ? 'Strong' : score===2 ? 'Fair' : 'Weak') : '';
    };
    fields.forEach(input => { input.addEventListener('blur', () => { check(input); refresh(); }); input.addEventListener('input', () => { if (input.dataset.touched) check(input); input.dataset.touched='1'; refresh(); }); });
    $('#terms')?.addEventListener('change', () => { errors.terms.textContent = $('#terms').checked ? '' : 'You must accept the Terms of Service to continue'; refresh(); });
    $('#toggle-password')?.addEventListener('click', () => { pass.type = pass.type === 'password' ? 'text' : 'password'; $('#toggle-password').textContent = pass.type === 'password' ? 'Show' : 'Hide'; });
    form?.addEventListener('submit', (e) => { e.preventDefault(); fields.forEach(i=>i.dataset.touched='1'); fields.forEach(check); if (submit.disabled) { errors.terms.textContent = $('#terms').checked ? '' : 'You must accept the Terms of Service to continue'; return; } submit.disabled = true; fields.forEach(i=>i.disabled=true); submit.textContent = 'Creating account…'; sessionStorage.setItem(emailKey, email.value.trim()); setTimeout(() => window.location.href='/verify', 1050); });
    refresh();
  }
  if (path === '/verify') {
    const email = sessionStorage.getItem(emailKey); const target = $('#verify-email'); if (target) target.textContent = email || 'your email address';
    const inputs = [...document.querySelectorAll('.otp-row input')]; const verify = $('#verify-submit'); const status = $('#verify-status'); const resend = $('#resend'); const timer = $('#timer'); let seconds=45;
    const update = () => { if (timer) timer.textContent = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`; resend.disabled = seconds>0; };
    const tick = setInterval(() => { if(seconds>0) {seconds--; update();} else clearInterval(tick); }, 1000); update();
    const tryVerify = () => { const code = inputs.map(i=>i.value).join(''); if(code.length<6) return; verify.disabled=true; verify.textContent='Verifying…'; status.textContent=''; setTimeout(()=>window.location.href='/loading',900); };
    inputs.forEach((input,i)=> { input.addEventListener('input',()=>{ input.value=input.value.replace(/\D/g,'').slice(0,1); if(input.value && inputs[i+1]) inputs[i+1].focus(); if(inputs.every(x=>x.value)) tryVerify(); }); input.addEventListener('keydown',e=>{ if(e.key==='Backspace'&&!input.value&&inputs[i-1]) inputs[i-1].focus(); if(e.key==='ArrowLeft'&&inputs[i-1]) inputs[i-1].focus(); if(e.key==='ArrowRight'&&inputs[i+1]) inputs[i+1].focus(); }); input.addEventListener('paste',e=>{ e.preventDefault(); const v=e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6); v.split('').forEach((n,j)=>{if(inputs[j]) inputs[j].value=n}); if(v.length===6) tryVerify(); }); });
    verify?.addEventListener('click',tryVerify); resend?.addEventListener('click',()=>{ if(seconds>0) return; seconds=45; update(); status.textContent='A new verification code has been sent.'; });
  }
})();
