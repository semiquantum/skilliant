/* =========================================================
   ROOT WITHDRAWAL FIX
   One delegated event system for Performance & Finance + Wallet.
   Avoids conflicting legacy handlers and guarantees first-click actions.
========================================================= */
(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const money=n=>'₹'+Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0});
  const KEY='skilliant_day4_finance_v1';
  const PAYMENT_KEY='skilliant_day5_profile_v1';
  let pending=null;
  let bound=false;

  function finance(){
    try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}
  }
  function payment(){
    try{
      const s=JSON.parse(localStorage.getItem(PAYMENT_KEY)||'{}');
      return Object.assign({holder:'Rahul Sharma',account:'456789012345',ifsc:'SBIN0001234',bank:'State Bank of India',upi:'rahul@okaxis'},s.payment||{});
    }catch{return {holder:'Rahul Sharma',account:'456789012345',ifsc:'SBIN0001234',bank:'State Bank of India',upi:'rahul@okaxis'}}
  }
  function getBalance(){
    const f=finance();
    if(f.wallet && Number.isFinite(Number(f.wallet.balance))) return Number(f.wallet.balance);
    const el=$('#d4WalletBalance')||$('#walletBalance');
    return Number(String(el?.textContent||'18750').replace(/[^0-9.]/g,''))||0;
  }
  function setBalance(v){
    const txt=money(v);
    $('#d4WalletBalance')?.replaceChildren(document.createTextNode(txt));
    $('#walletBalance')?.replaceChildren(document.createTextNode(txt));
    document.querySelectorAll('[data-wallet-balance]').forEach(x=>x.textContent=txt);
  }
  function modal(){return $('#d4Modal')}
  function show(html){
    const m=modal(),c=$('#d4ModalContent');
    if(!m||!c) return false;
    c.innerHTML=html;
    // Bind the newly-created controls directly as a second reliable path.
    // The handlers are intentionally small and stop bubbling so the legacy
    // Day 4 listeners cannot compete with the root withdrawal flow.
    const reviewBtn=c.querySelector('[data-root-review]');
    if(reviewBtn) reviewBtn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();review();},{once:true});
    const confirmBtn=c.querySelector('[data-root-confirm]');
    if(confirmBtn) confirmBtn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();confirm();},{once:true});
    const backBtn=c.querySelector('[data-root-back]');
    if(backBtn) backBtn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();open();},{once:true});
    c.querySelectorAll('[data-root-close],[data-d4-close]').forEach(btn=>btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();close();},{once:true}));
    m.classList.add('open');
    m.setAttribute('aria-hidden','false');
    m.style.display='block';
    document.body.style.overflow='hidden';
    return true;
  }
  function close(){
    const m=modal();
    if(!m)return;
    m.classList.remove('open');
    m.setAttribute('aria-hidden','true');
    m.style.display='none';
    document.body.style.overflow='';
    pending=null;
  }
  function toast(msg){
    if(typeof window.showDay5Notification==='function'){window.showDay5Notification(msg);return}
    if(typeof window.showDay3Toast==='function'){window.showDay3Toast('Success',msg,'success');return}
    let n=$('#rootWithdrawToast');
    if(!n){n=document.createElement('div');n.id='rootWithdrawToast';n.className='root-withdraw-toast';document.body.appendChild(n)}
    n.textContent=msg;n.classList.add('show');clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('show'),3200);
  }
  function renderTransactions(){
    const f=finance(), rows=Array.isArray(f.transactions)?f.transactions:[];
    const body=$('#d4TransactionBody');
    if(!body)return;
    const existing=body.innerHTML;
    const t=rows[0];
    if(!t)return;
    if(existing && existing.includes(t.id))return;
    const tr=document.createElement('tr');
    tr.innerHTML=`<td><div class="d4-tx-main"><div class="d4-tx-icon withdraw"><i class="fa-solid fa-arrow-up-right"></i></div><div><strong>${esc(t.title)}</strong><small style="display:block;color:#94a3b8;font-size:9px">${esc(t.id)}</small></div></div></td><td>${esc(t.date)}</td><td>${esc(t.method)}</td><td><strong>−${money(t.amount)}</strong></td><td><span class="d4-tx-status pending">pending</span></td><td></td>`;
    body.prepend(tr);
  }
  function saveWithdrawal(amount,destination){
    const f=finance();
    f.wallet=Object.assign({balance:18750,total:25800,pending:3200},f.wallet||{});
    f.wallet.balance=Math.max(0,Number(f.wallet.balance)-amount);
    f.transactions=Array.isArray(f.transactions)?f.transactions:[];
    const id='TXN-'+Date.now().toString().slice(-6);
    f.transactions.unshift({id,type:'withdraw',title:'Wallet withdrawal',date:new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),method:destination,amount,status:'pending',detail:'Withdrawal submitted and awaiting payment-provider processing.'});
    localStorage.setItem(KEY,JSON.stringify(f));
    setBalance(f.wallet.balance);
    renderTransactions();
    window.dispatchEvent(new CustomEvent('skilliant:finance-updated',{detail:f}));
  }
  function open(){
    const p=payment(),b=getBalance();
    show(`<div class="root-finance-head"><span>SECURE PAYOUT</span><h2>Withdraw Earnings</h2><p>Your registered payout details are shown below. Choose a method and enter the amount.</p></div>
      <div class="root-balance"><div><small>Available balance</small><strong>${money(b)}</strong></div><span>Verified</span></div>
      <div class="root-bank-grid"><article><b><i class="fa-solid fa-building-columns"></i> Bank Account</b><strong>${esc(p.bank)}</strong><small>Holder: ${esc(p.holder)}</small><small>Account: •••• ${esc(String(p.account).slice(-4))}</small><small>IFSC: ${esc(p.ifsc)}</small></article><article><b><i class="fa-solid fa-mobile-screen-button"></i> UPI</b><strong>${esc(p.upi)}</strong><small>Verified payment ID</small><small>Instant payout available</small></article></div>
      <label class="root-field"><span>Withdrawal Amount</span><div><b>₹</b><input id="rootWithdrawAmount" type="number" inputmode="decimal" min="100" max="${b}" step="1" placeholder="Enter amount"></div><small id="rootWithdrawError"></small></label>
      <div class="root-methods"><button type="button" data-root-method="bank" class="active"><i class="fa-solid fa-building-columns"></i><span>Bank Account</span><b>•••• ${esc(String(p.account).slice(-4))}</b></button><button type="button" data-root-method="upi"><i class="fa-solid fa-mobile-screen-button"></i><span>UPI</span><b>${esc(p.upi)}</b></button></div>
      <div class="root-actions"><button type="button" class="day4-btn day4-btn-secondary" data-root-close>Cancel</button><button type="button" class="day4-btn day4-btn-primary" data-root-review>Review Withdrawal</button></div>`);
    $('#rootWithdrawAmount')?.focus();
  }
  function review(){
    const p=payment(),b=getBalance(),amount=Number($('#rootWithdrawAmount')?.value||0),err=$('#rootWithdrawError');
    if(!amount||amount<100){if(err)err.textContent='Minimum withdrawal is ₹100.';return}
    if(amount>b){if(err)err.textContent='Amount cannot exceed your available balance.';return}
    const method=$('.root-methods [data-root-method="upi"].active')?'upi':'bank';
    const destination=method==='upi'?p.upi:`${p.bank} •••• ${String(p.account).slice(-4)}`;
    pending={amount,destination};
    show(`<div class="root-finance-head"><span>FINAL CONFIRMATION</span><h2>Confirm Withdrawal</h2><p>Review the payout before submitting it.</p></div><div class="root-confirm"><div><span>Amount</span><strong>${money(amount)}</strong></div><div><span>Destination</span><strong>${esc(destination)}</strong></div><div><span>Processing</span><strong>Usually within 1 business day</strong></div></div><div class="root-actions"><button type="button" class="day4-btn day4-btn-secondary" data-root-back>Back</button><button type="button" class="day4-btn day4-btn-primary root-confirm-btn" data-root-confirm><i class="fa-solid fa-check"></i> Confirm Withdrawal</button></div>`);
  }
  function confirm(){
    if(!pending)return;
    const p=pending;
    saveWithdrawal(p.amount,p.destination);
    close();
    toast(`${money(p.amount)} withdrawal submitted successfully.`);
    pending=null;
  }
  // Stable public entry point used by the hit-area reliability patch.
  window.skilliantRootWithdrawConfirm=confirm;
  function bind(){
    if(bound)return;bound=true;
    // Bubble-phase delegation lets the actual button receive the click first,
    // avoiding the intermittent focus/selection behaviour seen with capture handlers.
    document.addEventListener('click',function(e){
      const target=e.target?.nodeType===3?e.target.parentElement:e.target;
      const top=target?.closest?.('#day4WithdrawTop,#d4WithdrawTop,#d4WithdrawBtn,#wallet .page-header button');
      const reviewBtn=target?.closest?.('[data-root-review]');
      const confirmBtn=target?.closest?.('[data-root-confirm]');
      const back=target?.closest?.('[data-root-back]');
      const closeBtn=target?.closest?.('[data-root-close],[data-d4-close]');
      const method=target?.closest?.('[data-root-method]');
      if(top){e.preventDefault();e.stopImmediatePropagation();open();return}
      if(method){e.preventDefault();e.stopImmediatePropagation();document.querySelectorAll('[data-root-method]').forEach(x=>x.classList.remove('active'));method.classList.add('active');return}
      if(reviewBtn){e.preventDefault();e.stopImmediatePropagation();review();return}
      if(confirmBtn){e.preventDefault();e.stopImmediatePropagation();confirm();return}
      if(back){e.preventDefault();e.stopImmediatePropagation();open();return}
      if(closeBtn){e.preventDefault();e.stopImmediatePropagation();close();return}
    });
    // Use click for the final action. A pointerdown handler can suppress the
    // browser's click event and was the source of intermittent confirmation
    // behaviour in some browsers.
    window.skilliantRootWithdraw=open;
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();
