/* =========================================================
   SKILLIANT ADVANCED UX FIXES
   Final polish: profile menu, search, finance withdrawal,
   profile editing, portfolio UX, dark mode, responsive shell.
========================================================= */
(function(){
  'use strict';
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const toast = (msg,type='success') => {
    if(typeof window.showDay5Notification==='function') return window.showDay5Notification(msg);
    let n=$('#day5Notification');
    if(!n){n=document.createElement('div');n.id='day5Notification';n.className='day5-notification';document.body.appendChild(n)}
    n.innerHTML=`<i class="fa-solid ${type==='error'?'fa-circle-exclamation':'fa-circle-check'}"></i><span></span><button type="button">×</button>`;
    n.querySelector('span').textContent=msg;n.classList.add('show');clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('show'),3000);n.querySelector('button').onclick=()=>n.classList.remove('show');
  };
  const go = id => { const item=$(`.sidebar .menu li[onclick*="'${id}'"]`); if(typeof window.showPage==='function') window.showPage(id,item); };

  /* ---------- Profile dropdown ---------- */
  function buildProfileMenu(){
    const d=$('#profileDropdown'); if(!d)return;
    d.innerHTML=`<div class="advanced-profile-head"><div class="advanced-avatar">RS</div><div><strong>Rahul Sharma</strong><span>Professional Electrician</span></div></div>
      <button type="button" data-profile-action="profile"><i class="fa-solid fa-user"></i><span><b>My Profile</b><small>Professional profile</small></span></button>
      <button type="button" data-profile-action="settings"><i class="fa-solid fa-gear"></i><span><b>Settings</b><small>Account preferences</small></span></button>
      <button type="button" data-profile-action="notifications"><i class="fa-solid fa-bell"></i><span><b>Notifications</b><small>View your latest alerts</small></span><em class="advanced-menu-dot"></em></button>
      <button type="button" data-profile-action="theme"><i class="fa-solid fa-circle-half-stroke"></i><span><b>Appearance</b><small>Switch light / dark mode</small></span></button>
      <div class="advanced-profile-divider"></div>
      <button type="button" class="advanced-logout-item" data-profile-action="logout"><i class="fa-solid fa-right-from-bracket"></i><span><b>Logout</b><small>End this session</small></span></button>`;
    d.addEventListener('click',e=>{
      const b=e.target.closest('[data-profile-action]'); if(!b)return;
      e.preventDefault();e.stopPropagation();
      const a=b.dataset.profileAction;
      d.classList.remove('show');d.style.display='none';
      if(a==='profile') go('profilePage');
      if(a==='settings') go('settings');
      if(a==='notifications') window.toggleNotificationPanel?.();
      if(a==='theme') $('#themeToggle')?.click();
      if(a==='logout') window.openLogoutModal?.();
    });
  }

  /* ---------- Search ---------- */
  function setupSearch(){
    const input=$('.search-box input'); if(!input || input.dataset.advancedBound)return;
    input.dataset.advancedBound='1';
    let empty=$('#advancedSearchEmpty');
    if(!empty){
      empty=document.createElement('div');empty.id='advancedSearchEmpty';empty.className='advanced-search-empty';
      empty.innerHTML='<i class="fa-solid fa-magnifying-glass"></i><h3>No matching jobs</h3><p>Try a different job title, category, location or customer name.</p>';
      $('#jobs')?.appendChild(empty);
    }
    const cards=()=>$$('#jobs .job-card, #jobs .request-card, #jobs .day3-request-card');
    const run=()=>{
      const q=input.value.trim().toLowerCase();
      if(q) go('jobs');
      const all=cards();let hits=0;
      all.forEach(c=>{const match=!q || c.innerText.toLowerCase().includes(q);c.style.display=match?'':'none';if(match)hits++});
      if(empty)empty.classList.toggle('show',!!q && hits===0);
    };
    input.addEventListener('input',run);
    input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();run();}});
    document.addEventListener('click',e=>{if(e.target.closest('.search-box') && input.value.trim())run()},{capture:true});
  }

  /* ---------- Finance / withdrawal ---------- */
  function payment(){
    try{return JSON.parse(localStorage.getItem('skilliant_day5_profile_v1')||'{}').payment || {holder:'Rahul Sharma',account:'456789012345',ifsc:'SBIN0001234',bank:'State Bank of India',upi:'rahul@okaxis'}}catch{return {holder:'Rahul Sharma',account:'456789012345',ifsc:'SBIN0001234',bank:'State Bank of India',upi:'rahul@okaxis'}}
  }
  function money(n){return '₹'+Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0});}
  function balance(){
    const el=$('#d4WalletBalance') || $('#walletBalance');
    if(!el)return 0;
    return Number(String(el.textContent).replace(/[^0-9.]/g,''))||0;
  }
  function setBalance(v){
    const vtxt=money(v); $('#d4WalletBalance')&&( $('#d4WalletBalance').textContent=vtxt ); $('#walletBalance')&&( $('#walletBalance').textContent=vtxt );
  }
  function d4Modal(html){
    const m=$('#d4Modal'),c=$('#d4ModalContent');if(!m||!c)return null;c.innerHTML=html;m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');return m;
  }
  function closeD4(){const m=$('#d4Modal');if(m){m.classList.remove('open');m.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}}
  function openWithdraw(){
    const p=payment(),b=balance();
    d4Modal(`<div class="advanced-finance-head"><span>SECURE PAYOUT</span><h2>Withdraw Earnings</h2><p>Transfer your available earnings to your registered bank account or UPI.</p></div>
      <div class="advanced-balance-box"><div><small>Available balance</small><strong>${money(b)}</strong></div><span><i class="fa-solid fa-shield-check"></i> Verified</span></div>
      <div class="advanced-bank-grid"><article><div class="advanced-bank-title"><i class="fa-solid fa-building-columns"></i><span>Bank Account</span></div><strong>${esc(p.bank)}</strong><small>Holder: ${esc(p.holder)}</small><small>Account: •••• ${esc(String(p.account).slice(-4))}</small><small>IFSC: ${esc(p.ifsc)}</small></article><article><div class="advanced-bank-title"><i class="fa-solid fa-mobile-screen-button"></i><span>UPI</span></div><strong>${esc(p.upi)}</strong><small>Verified payment ID</small><small>Instant payout available</small></article></div>
      <label class="advanced-field"><span>Withdrawal Amount</span><div class="advanced-input-wrap"><span>₹</span><input id="advancedWithdrawAmount" type="number" min="100" max="${b}" step="1" placeholder="Enter amount"></div><small id="advancedWithdrawError"></small></label>
      <div class="advanced-method-row"><button type="button" class="advanced-method active" data-method="bank"><i class="fa-solid fa-building-columns"></i><span>Bank Account</span><b>•••• ${esc(String(p.account).slice(-4))}</b></button><button type="button" class="advanced-method" data-method="upi"><i class="fa-solid fa-mobile-screen-button"></i><span>UPI</span><b>${esc(p.upi)}</b></button></div>
      <div class="advanced-modal-actions"><button type="button" class="day4-btn day4-btn-secondary" data-adv-close>Cancel</button><button type="button" class="day4-btn day4-btn-primary" id="advancedReviewWithdraw"><i class="fa-solid fa-arrow-right"></i> Review Withdrawal</button></div>`);
    let method='bank';
    $$('.advanced-method').forEach(x=>x.addEventListener('click',()=>{$$('.advanced-method').forEach(y=>y.classList.remove('active'));x.classList.add('active');method=x.dataset.method}));
    $('#advancedReviewWithdraw').onclick=()=>{
      const amount=Number($('#advancedWithdrawAmount')?.value||0),err=$('#advancedWithdrawError');
      if(amount<100){err.textContent='Minimum withdrawal is ₹100.';return} if(amount>b){err.textContent='Amount cannot exceed your available balance.';return}
      const destination=method==='bank'?`${p.bank} •••• ${String(p.account).slice(-4)}`:p.upi;
      d4Modal(`<div class="advanced-finance-head"><span>FINAL CONFIRMATION</span><h2>Confirm Withdrawal</h2><p>Review the payout before submitting it.</p></div><div class="advanced-confirm-box"><div><span>Amount</span><strong>${money(amount)}</strong></div><div><span>Destination</span><strong>${esc(destination)}</strong></div><div><span>Processing</span><strong>Usually within 1 business day</strong></div></div><div class="advanced-modal-actions"><button type="button" class="day4-btn day4-btn-secondary" data-adv-back>Back</button><button type="button" class="day4-btn day4-btn-primary" id="advancedConfirmWithdraw"><i class="fa-solid fa-check"></i> Confirm Withdrawal</button></div>`);
      $('#advancedConfirmWithdraw').onclick=()=>{
        const nextBalance=Math.max(0,b-amount);
        setBalance(nextBalance);
        try{
          const raw=localStorage.getItem('skilliant_day4_finance_v1');
          const finance=raw?JSON.parse(raw):{};
          finance.wallet=Object.assign({balance:nextBalance,total:25800,pending:3200},finance.wallet||{}, {balance:nextBalance});
          finance.transactions=Array.isArray(finance.transactions)?finance.transactions:[];
          finance.transactions.unshift({id:'TXN-'+Date.now().toString().slice(-6),type:'withdraw',title:'Wallet withdrawal',date:new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),method:destination,amount,status:'pending',detail:'Withdrawal is being processed.'});
          localStorage.setItem('skilliant_day4_finance_v1',JSON.stringify(finance));
        }catch{}
        const tbody=$('#d4TransactionBody');if(tbody){const tr=document.createElement('tr');tr.innerHTML=`<td><div class="d4-tx-main"><div class="d4-tx-icon withdraw"><i class="fa-solid fa-arrow-up-right"></i></div><div><strong>Wallet withdrawal</strong><small style="display:block;color:#94a3b8;font-size:9px">TXN-${Date.now().toString().slice(-6)}</small></div></div></td><td>${new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</td><td>${esc(destination)}</td><td><strong>−${money(amount)}</strong></td><td><span class="d4-tx-status pending">pending</span></td><td></td>`;tbody.prepend(tr)}
        closeD4();toast(`${money(amount)} withdrawal submitted successfully.`);
      };
    };
    $('[data-adv-close]')?.addEventListener('click',closeD4);$('[data-adv-back]')?.addEventListener('click',openWithdraw);
  }
  function bindFinance(){
    // The final root withdrawal controller owns the finance flow. Older
    // capture-phase handlers are intentionally disabled here because they
    // could steal the first click and leave stale modal state behind.
    const buttons=['#day4WithdrawTop','#d4WithdrawTop','#d4WithdrawBtn','#wallet .page-header button'];
    buttons.forEach(sel=>{
      const b=$(sel);
      if(!b)return;
      b.type='button';
      b.removeAttribute('onclick');
      b.setAttribute('aria-haspopup','dialog');
    });
    window.skilliantOpenWithdraw=function(){
      if(typeof window.skilliantRootWithdraw==='function') return window.skilliantRootWithdraw();
      setTimeout(()=>window.skilliantRootWithdraw?.(),0);
    };
  }

  /* ---------- Profile edit reliability ---------- */
  function bindProfileEdit(){
    document.addEventListener('click',e=>{
      const b=e.target.closest('.profile-edit-btn');if(!b)return;
      e.preventDefault();e.stopImmediatePropagation();
      const name=$('.profile-information h2')?.textContent.trim()||'Rahul Sharma',role=$('.profile-role')?.textContent.replace(/\s+/g,' ').trim()||'Professional Electrician',loc=$('.profile-location')?.textContent.replace(/\s+/g,' ').trim()||'Panaji, Goa',about=$('.about-text')?.textContent.trim()||'';
      const modal=document.createElement('div');modal.className='advanced-edit-overlay';modal.innerHTML=`<div class="advanced-edit-card"><button class="advanced-close" type="button">×</button><span class="advanced-kicker">PROFILE EDITOR</span><h2>Update professional profile</h2><p>Keep your public labour profile accurate and professional.</p><label class="advanced-field"><span>Full Name</span><input id="advProfileName" value="${esc(name)}"></label><label class="advanced-field"><span>Profession</span><input id="advProfileRole" value="${esc(role)}"></label><label class="advanced-field"><span>Location</span><input id="advProfileLoc" value="${esc(loc)}"></label><label class="advanced-field"><span>About</span><textarea id="advProfileAbout" rows="4">${esc(about)}</textarea></label><div class="advanced-modal-actions"><button class="day4-btn day4-btn-secondary" type="button" data-adv-close>Cancel</button><button class="day4-btn day4-btn-primary" type="button" id="advSaveProfile"><i class="fa-solid fa-check"></i> Save Profile</button></div></div>`;
      document.body.appendChild(modal);
      const close=()=>modal.remove();modal.querySelectorAll('[data-adv-close],.advanced-close').forEach(x=>x.onclick=close);
      modal.querySelector('#advSaveProfile').onclick=()=>{const n=$('#advProfileName',modal).value.trim(),r=$('#advProfileRole',modal).value.trim(),l=$('#advProfileLoc',modal).value.trim(),a=$('#advProfileAbout',modal).value.trim();if(!n||!r||!l){toast('Please complete name, profession and location.','error');return}$('.profile-information h2').textContent=n;$('.profile-role').innerHTML=`<i class="fa-solid fa-bolt"></i> ${esc(r)}`;$('.profile-location').innerHTML=`<i class="fa-solid fa-location-dot"></i> ${esc(l)}`;if($('.about-text')&&a) $('.about-text').textContent=a;try{const k='skilliant_day5_profile_v1',s=JSON.parse(localStorage.getItem(k)||'{}');s.profile=Object.assign({},s.profile,{name:n,profession:r,location:l,about:a});localStorage.setItem(k,JSON.stringify(s))}catch{}close();toast('Profile updated successfully.');};
      setTimeout(()=>$('#advProfileName',modal)?.focus(),50);
    },true);
  }

  /* ---------- Dark mode ---------- */
  function setupTheme(){
    const apply=()=>{const t=document.documentElement.getAttribute('data-theme')||'light';document.body.classList.toggle('advanced-dark',t==='dark');};apply();
    $('#themeToggle')?.addEventListener('click',()=>setTimeout(apply,20));
    const obs=new MutationObserver(apply);obs.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
  }

  /* ---------- Portfolio presentation ---------- */
  function polishPortfolio(){
    const page=$('#portfolio');if(!page)return;
    page.classList.add('advanced-portfolio-page');
    $('.page-header',page)?.classList.add('advanced-page-header');
  }

  /* ---------- Settings / logout ---------- */
  function polishSidebar(){
    $$('.sidebar .menu li').forEach(li=>{const text=li.textContent.trim().toLowerCase();if(text==='settings'){li.classList.add('advanced-sidebar-settings')}if(text==='logout'){li.classList.add('advanced-sidebar-logout')}});
  }

  function init(){
    buildProfileMenu();setupSearch();bindFinance();bindProfileEdit();setupTheme();polishPortfolio();polishSidebar();
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#d4Modal')?.classList.remove('open');$$('.advanced-edit-overlay').forEach(x=>x.remove());}});
    console.log('✓ Advanced Skilliant UX fixes loaded');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
