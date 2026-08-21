/* =========================================================
   SKILLIANT — FINAL RELIABILITY + FINANCE SYNC
   Single source of truth for withdrawal transactions.
   Fixes first-click confirmation, stale transaction history,
   wallet balance sync and responsive finance interactions.
========================================================= */
(function(){
  'use strict';

  const FINANCE_KEY='skilliant_day4_finance_v1';
  const PAYMENT_KEY='skilliant_day5_profile_v1';
  const $=(s,r=document)=>r.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const money=n=>'₹'+Number(n||0).toLocaleString('en-IN');

  function readFinance(){
    try{
      const raw=JSON.parse(localStorage.getItem(FINANCE_KEY)||'{}');
      return {
        wallet:Object.assign({balance:18750,total:25800,pending:3200},raw.wallet||{}),
        transactions:Array.isArray(raw.transactions)?raw.transactions:[]
      };
    }catch(_){
      return {wallet:{balance:18750,total:25800,pending:3200},transactions:[]};
    }
  }

  function readPayment(){
    try{
      const raw=JSON.parse(localStorage.getItem(PAYMENT_KEY)||'{}');
      return Object.assign({
        holder:'Rahul Sharma', account:'456789012345',
        ifsc:'SBIN0001234', bank:'State Bank of India', upi:'rahul@okaxis'
      },raw.payment||{});
    }catch(_){
      return {holder:'Rahul Sharma',account:'456789012345',ifsc:'SBIN0001234',bank:'State Bank of India',upi:'rahul@okaxis'};
    }
  }

  function writeFinance(f){
    localStorage.setItem(FINANCE_KEY,JSON.stringify(f));
    window.dispatchEvent(new CustomEvent('skilliant:finance-updated',{detail:f}));
  }

  function toast(message,type='success'){
    if(typeof window.showDay5Notification==='function'){
      window.showDay5Notification(message);
      return;
    }
    let n=$('#finalFinanceToast');
    if(!n){
      n=document.createElement('div');
      n.id='finalFinanceToast';
      n.className='final-finance-toast';
      document.body.appendChild(n);
    }
    n.innerHTML=`<i class="fa-solid ${type==='error'?'fa-circle-exclamation':'fa-circle-check'}"></i><span>${esc(message)}</span>`;
    n.classList.add('show');
    clearTimeout(n._timer);
    n._timer=setTimeout(()=>n.classList.remove('show'),3200);
  }

  function syncWallet(){
    const f=readFinance();
    const ids=['d4WalletBalance','walletBalance'];
    ids.forEach(id=>{
      const el=$('#'+id);
      if(el) el.textContent=money(f.wallet.balance);
    });
    const total=$('#d4TotalEarnings'); if(total) total.textContent=money(f.wallet.total);
    const pending=$('#d4PendingPayout'); if(pending) pending.textContent=money(f.wallet.pending);
    document.querySelectorAll('[data-wallet-balance]').forEach(el=>el.textContent=money(f.wallet.balance));
  }

  function renderTransactions(){
    const body=$('#d4TransactionBody');
    if(!body)return;
    const f=readFinance();
    const search=($('#d4TransactionSearch')?.value||'').trim().toLowerCase();
    const filter=$('#d4TransactionFilter')?.value||'all';

    const rows=f.transactions.filter(t=>{
      const hay=[t.id,t.title,t.date,t.method,t.status,t.detail].join(' ').toLowerCase();
      return (filter==='all'||String(t.status)===filter) && (!search||hay.includes(search));
    });

    body.innerHTML=rows.map(t=>`
      <tr>
        <td>
          <div class="d4-tx-main">
            <div class="d4-tx-icon ${t.type==='withdraw'?'withdraw':''}">
              <i class="fa-solid ${t.type==='withdraw'?'fa-arrow-up-right':'fa-arrow-down-left'}"></i>
            </div>
            <div>
              <strong>${esc(t.title||'Transaction')}</strong>
              <small style="display:block;color:#94a3b8;font-size:9px">${esc(t.id||'')}</small>
            </div>
          </div>
        </td>
        <td>${esc(t.date||'')}</td>
        <td>${esc(t.method||'')}</td>
        <td><strong>${t.type==='withdraw'?'−':'+'}${money(t.amount)}</strong></td>
        <td><span class="d4-tx-status ${esc(t.status||'pending')}">${esc(t.status||'pending')}</span></td>
        <td><button type="button" class="d4-view-btn final-tx-view" data-final-tx="${esc(t.id)}" aria-label="View transaction"><i class="fa-solid fa-eye"></i></button></td>
      </tr>
    `).join('');

    const empty=$('#d4TransactionEmpty');
    if(empty) empty.hidden=rows.length>0;
  }

  function renderWalletRecentTransactions(){
    const wallet=document.querySelector('#wallet');
    if(!wallet)return;
    const table=wallet.querySelector('.transaction-table table');
    const body=table?.querySelector('tbody');
    if(!body)return;

    const rows=readFinance().transactions.slice(0,8);
    if(!rows.length){
      body.innerHTML='<tr><td colspan=\"4\" style=\"text-align:center;padding:24px;color:#64748b;\">No transactions yet</td></tr>';
      return;
    }

    body.innerHTML=rows.map(t=>{
      const withdrawal=t.type==='withdraw';
      const status=String(t.status||'pending');
      const statusLabel=status.charAt(0).toUpperCase()+status.slice(1);
      return `<tr>
        <td>${esc(t.date||'')}</td>
        <td class=\"${withdrawal?'debit':'credit'}\">${withdrawal?'Withdraw':'Credit'}</td>
        <td>${withdrawal?'−':'+'}${money(t.amount)}</td>
        <td>${esc(statusLabel)}</td>
      </tr>`;
    }).join('');
  }

  function syncFinanceUI(){
    syncWallet();
    renderTransactions();
    renderWalletRecentTransactions();
  }

  function showTransaction(id){
    const t=readFinance().transactions.find(x=>String(x.id)===String(id));
    if(!t)return;
    const modal=$('#d4Modal'),content=$('#d4ModalContent');
    if(!modal||!content)return;
    content.innerHTML=`
      <span class="day4-label">TRANSACTION DETAILS</span>
      <h2>${esc(t.title||'Transaction')}</h2>
      <p>${esc(t.detail||'Transaction recorded in your wallet history.')}</p>
      <div class="d4-tx-detail">
        <div><span>Transaction ID</span><strong>${esc(t.id)}</strong></div>
        <div><span>Date</span><strong>${esc(t.date)}</strong></div>
        <div><span>Method</span><strong>${esc(t.method)}</strong></div>
        <div><span>Amount</span><strong>${t.type==='withdraw'?'−':'+'}${money(t.amount)}</strong></div>
        <div><span>Payment Status</span><strong style="text-transform:capitalize">${esc(t.status)}</strong></div>
      </div>
      <div class="d4-modal-actions"><button type="button" class="day4-btn day4-btn-primary final-tx-close">Done</button></div>
    `;
    modal.classList.add('open');
    modal.style.display='block';
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }

  function closeFinanceModal(){
    const m=$('#d4Modal');
    if(!m)return;
    m.classList.remove('open');
    m.style.display='none';
    m.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  function hardenRootButtons(){
    // Make sure dynamically-created confirmation buttons never become
    // text-selection targets or lose their click area.
    document.querySelectorAll('#d4Modal [data-root-review],#d4Modal [data-root-confirm],#d4Modal [data-root-back],#d4Modal [data-root-close]')
      .forEach(b=>{
        b.type='button';
        b.style.pointerEvents='auto';
        b.style.userSelect='none';
        b.style.webkitUserSelect='none';
      });
  }

  function bind(){
    document.addEventListener('click',e=>{
      const view=e.target.closest('[data-final-tx]');
      if(view){
        e.preventDefault();
        e.stopPropagation();
        showTransaction(view.getAttribute('data-final-tx'));
        return;
      }
      if(e.target.closest('.final-tx-close')){
        e.preventDefault();
        e.stopPropagation();
        closeFinanceModal();
      }
    });

    $('#d4TransactionSearch')?.addEventListener('input',renderTransactions);
    $('#d4TransactionFilter')?.addEventListener('change',renderTransactions);

    document.addEventListener('click',e=>{
      if(e.target.closest('[data-day4-nav]')||e.target.closest('[onclick*="showPage(\'day4\'"]')){
        setTimeout(syncFinanceUI,50);
      }
    });

    window.addEventListener('skilliant:finance-updated',syncFinanceUI);
    window.addEventListener('storage',e=>{
      if(e.key===FINANCE_KEY)syncFinanceUI();
    });

    // Observe modal replacements made by the root withdrawal controller.
    const modal=$('#d4Modal');
    if(modal){
      new MutationObserver(()=>hardenRootButtons()).observe(modal,{subtree:true,childList:true});
    }

    syncFinanceUI();
    hardenRootButtons();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});
  else bind();

  window.skilliantSyncFinance=syncFinanceUI;
})();
