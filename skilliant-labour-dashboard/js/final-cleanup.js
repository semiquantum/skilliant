/* =========================================================
   SKILLIANT FINAL CLEAN CONTROLLER
   Authentication • Notifications • Theme • UX hardening
========================================================= */
(function(){
  'use strict';
  const AUTH_KEY='skilliant_auth_session_v2';
  const USER_KEY='skilliant_demo_user_v2';
  const DEFAULT_USER={email:'rahul.sharma@skilliant.com',password:'Skilliant@123',name:'Rahul Sharma'};
  const notifications=[
    {id:1,icon:'fa-briefcase',title:'New job request',text:'Priya Mehta requested AC Servicing.',time:'10 min ago',unread:true},
    {id:2,icon:'fa-wallet',title:'Payment received',text:'₹1,200 was added to your earnings.',time:'1 hour ago',unread:true},
    {id:3,icon:'fa-star',title:'New customer review',text:'You received a 5-star rating.',time:'Yesterday',unread:true}
  ];
  const $=id=>document.getElementById(id);
  const safeJSON=(v,f)=>{try{return JSON.parse(v)||f}catch{return f}};
  function getUser(){
    const stored=safeJSON(localStorage.getItem(USER_KEY),null);
    if(!stored || typeof stored.email!=='string' || typeof stored.password!=='string'){
      localStorage.setItem(USER_KEY,JSON.stringify(DEFAULT_USER));
      return {...DEFAULT_USER};
    }
    return Object.assign({},DEFAULT_USER,stored);
  }
  function setUser(u){localStorage.setItem(USER_KEY,JSON.stringify(u))}

  // One-time cleanup for older auth versions. This prevents stale Google/demo
  // session data from breaking the known working demo credentials.
  const AUTH_MIGRATION_KEY='skilliant_auth_clean_v1';
  if(localStorage.getItem(AUTH_MIGRATION_KEY)!=='1'){
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    localStorage.setItem(USER_KEY,JSON.stringify(DEFAULT_USER));
    localStorage.setItem(AUTH_MIGRATION_KEY,'1');
  }
  function isLoggedIn(){return localStorage.getItem(AUTH_KEY)==='1'||sessionStorage.getItem(AUTH_KEY)==='1'}
  function setLoggedIn(v,remember=true){if(v){if(remember){localStorage.setItem(AUTH_KEY,'1');sessionStorage.removeItem(AUTH_KEY)}else{sessionStorage.setItem(AUTH_KEY,'1');localStorage.removeItem(AUTH_KEY)}}else{localStorage.removeItem(AUTH_KEY);sessionStorage.removeItem(AUTH_KEY)}}
  function toast(message,type='success'){
    let n=$('day5Notification');
    if(!n){n=document.createElement('div');n.id='day5Notification';n.className='day5-notification';document.body.appendChild(n)}
    n.innerHTML=`<i class="fa-solid ${type==='error'?'fa-circle-exclamation':type==='warning'?'fa-triangle-exclamation':'fa-circle-check'}"></i><span></span><button type="button" aria-label="Close">×</button>`;
    n.querySelector('span').textContent=message;n.classList.add('show');clearTimeout(n._timer);n._timer=setTimeout(()=>n.classList.remove('show'),2800);n.querySelector('button').onclick=()=>n.classList.remove('show');
  }
  function showPortal(){
    $('authGate')?.classList.add('hidden');
    $('authGate')?.setAttribute('aria-hidden','true');
    $('portalAppShell')?.classList.remove('portal-hidden');
    $('portalAppShell')?.setAttribute('aria-hidden','false');
    document.body.classList.add('authenticated');
  }
  function showLogin(){
    $('authGate')?.classList.remove('hidden');
    $('authGate')?.setAttribute('aria-hidden','false');
    $('portalAppShell')?.classList.add('portal-hidden');
    $('portalAppShell')?.setAttribute('aria-hidden','true');
    document.body.classList.remove('authenticated');
    $('loginPassword')?.focus();
  }
  function clearErrors(){document.querySelectorAll('.auth-error').forEach(e=>e.textContent='')}
  function login(e){
    e.preventDefault();clearErrors();
    const email=($('loginEmail')?.value||'').trim().toLowerCase(), pass=$('loginPassword')?.value||'', user=getUser();
    let ok=true;
    if(!email){$('loginEmailError').textContent='Email is required.';ok=false}else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){$('loginEmailError').textContent='Enter a valid email address.';ok=false}
    if(!pass){$('loginPasswordError').textContent='Password is required.';ok=false}
    if(!ok)return;
    // Accept the built-in demo credentials even if an older browser session
    // contains a stale password in localStorage. A user-set password is also
    // accepted so the Forgot Password flow continues to work.
    const demoValid = email === DEFAULT_USER.email.toLowerCase() && pass === DEFAULT_USER.password;
    const storedValid = email === String(user.email).toLowerCase() && pass === String(user.password);
    if(!demoValid && !storedValid){$('loginPasswordError').textContent='Invalid email or password. Access denied.';toast('Invalid login details. Please try again.','error');return}
    setLoggedIn(true, $('rememberMe')?.checked !== false);
    showPortal();
    toast('Welcome back, '+(user.name || DEFAULT_USER.name)+'!');
  }
  function openForgot(){const m=$('forgotModal');if(m){m.classList.add('open');m.setAttribute('aria-hidden','false');setTimeout(()=>$('forgotEmail')?.focus(),60)}}
  function closeForgot(){const m=$('forgotModal');if(m){m.classList.remove('open');m.setAttribute('aria-hidden','true')}}
  function resetPassword(e){
    e.preventDefault();const email=($('forgotEmail')?.value||'').trim().toLowerCase(),p=$('forgotNewPassword')?.value||'',c=$('forgotConfirmPassword')?.value||'',err=$('forgotError');
    if(err)err.textContent='';const user=getUser();
    if(email!==String(user.email).toLowerCase()){if(err)err.textContent='No registered account matches this email.';return}
    if(p.length<8){if(err)err.textContent='Password must be at least 8 characters.';return}
    if(p!==c){if(err)err.textContent='Passwords do not match.';return}
    user.password=p;setUser(user);closeForgot();toast('Password reset successfully. You can sign in now.');$('loginEmail').value=email;$('loginPassword').value='';
  }
  function closeAnyModals(){document.querySelectorAll('.modal.active,.modal[style*="display: flex"],.day5-modal.open,.d4-modal.open').forEach(m=>{m.classList.remove('active','open');m.style.display='none'});document.body.style.overflow=''}
  function renderNotifications(){
    const list=$('notificationList');if(!list)return;const unread=notifications.filter(n=>n.unread).length;
    list.innerHTML=notifications.map(n=>`<button type="button" class="notification-item ${n.unread?'unread':''}" data-notification-id="${n.id}"><span class="notification-icon"><i class="fa-solid ${n.icon}"></i></span><span class="notification-copy"><strong>${n.title}</strong><span>${n.text}</span><small>${n.time}</small></span>${n.unread?'<b class="notification-dot"></b>':''}</button>`).join('');
    const bell=$('notificationBell');if(bell){const b=bell.querySelector('.badge');if(b){b.textContent=unread;b.style.display=unread?'grid':'none'}}
  }
  function toggleNotificationPanel(e){e?.preventDefault();e?.stopPropagation();const p=$('notificationPanel');if(!p)return;const open=!p.classList.contains('open');p.classList.toggle('open',open);p.setAttribute('aria-hidden',String(!open));if(open){document.querySelector('.profile-dropdown')?.classList.remove('show')}}
  function closeNotificationPanel(){const p=$('notificationPanel');if(p){p.classList.remove('open');p.setAttribute('aria-hidden','true')}}
  function bindNotifications(){
    $('notificationBell')?.addEventListener('click',toggleNotificationPanel,true);
    $('markNotificationsRead')?.addEventListener('click',()=>{notifications.forEach(n=>n.unread=false);renderNotifications();toast('All notifications marked as read')});
    $('notificationList')?.addEventListener('click',e=>{const item=e.target.closest('[data-notification-id]');if(!item)return;const n=notifications.find(x=>String(x.id)===item.dataset.notificationId);if(n)n.unread=false;renderNotifications();toast(n?.title||'Notification opened');});
    document.addEventListener('click',e=>{if(!e.target.closest('#notificationPanel')&&!e.target.closest('#notificationBell'))closeNotificationPanel()});
  }
  function bindTheme(){
    const saved=localStorage.getItem('skilliant_theme')||'light';document.documentElement.setAttribute('data-theme',saved);updateThemeIcon(saved);
    $('themeToggle')?.addEventListener('click',e=>{e.preventDefault();const next=(document.documentElement.getAttribute('data-theme')||'light')==='dark'?'light':'dark';localStorage.setItem('skilliant_theme',next);document.documentElement.setAttribute('data-theme',next);updateThemeIcon(next);toast(next==='dark'?'Dark mode enabled':'Light mode enabled')});
  }
  function updateThemeIcon(theme){const b=$('themeToggle');if(b)b.innerHTML=theme==='dark'?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>'}
  function bindLogin(){
    // Authentication itself is owned by js/unified-auth-final.js. Do NOT
    // attach another submit/click handler here: two auth owners caused the
    // Sign In button to race and could also overwrite a freshly restored
    // Google session on the first OAuth callback.
    $('forgotPasswordBtn')?.addEventListener('click',openForgot);
    $('forgotForm')?.addEventListener('submit',resetPassword);
    document.querySelectorAll('[data-forgot-close]').forEach(b=>b.addEventListener('click',closeForgot));
    const togglePassword=(button,input)=>{if(!button||!input)return;const show=input.type==='password';input.type=show?'text':'password';button.setAttribute('aria-label',show?'Hide password':'Show password')};
    $('loginPasswordToggle')?.addEventListener('click',()=>togglePassword($('loginPasswordToggle'),$('loginPassword')));
    document.querySelectorAll('[data-password-toggle]').forEach(button=>button.addEventListener('click',()=>togglePassword(button,$(button.dataset.passwordToggle))));
    $('loginEmail')?.addEventListener('input',()=>{if($('loginEmailError'))$('loginEmailError').textContent=''});
    $('loginPassword')?.addEventListener('input',()=>{if($('loginPasswordError'))$('loginPasswordError').textContent=''});
  }
  function bindLogout(){
    // Logout is owned by js/logout-controller.js.
    // Do not register a second capture/onclick handler here.
  }
  function bindExport(){
    document.addEventListener('click',e=>{const b=e.target.closest('#analyticsExportBtn');if(!b)return;e.preventDefault();e.stopImmediatePropagation();if(typeof window.skilliantExportReport==='function')window.skilliantExportReport();else toast('Report export is unavailable.','error')},true);
  }
  function hardenInputs(){
    document.addEventListener('click',e=>{const control=e.target.closest('input,textarea,select,button,a,label');if(control && !e.target.closest('.sidebar .menu li')){control.style.pointerEvents='auto'}},true);
    document.addEventListener('focusin',e=>{if(e.target.matches('input,textarea,select'))e.target.style.pointerEvents='auto'});
  }
  function init(){
    localStorage.removeItem('skilliant_day1_todos');
    localStorage.removeItem('skilliant_logged_out');
    bindLogin();bindNotifications();bindTheme();bindLogout();bindExport();hardenInputs();renderNotifications();
    // Do not decide auth state here. Supabase is loaded later in index.html
    // and unified-auth-final.js is the single source of truth for both demo
    // email login and Supabase/Google session restoration.
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeForgot();closeNotificationPanel()}});
    console.log('%c✔ Skilliant final clean controller ready','color:#2563EB;font-weight:700');
  }
  window.toggleNotificationPanel=toggleNotificationPanel;window.closeNotificationPanel=closeNotificationPanel;
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
