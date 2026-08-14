/* =========================================================
   SKILLIANT LABOUR PORTAL — DAY 4
   Availability • Earnings • Ratings • Wallet • Transactions
========================================================= */
(function(){
  'use strict';

  const KEY='skilliant_day4_finance_v1';
  const DEFAULT={
    availability:{},
    wallet:{balance:18750,total:25800,pending:3200},
    transactions:[
      {id:'TXN-2048',type:'earning',title:'AC Servicing • Priya Mehta',date:'13 Aug 2026',method:'Job payment',amount:850,status:'completed',detail:'Payment received for AC servicing at Miramar, Panaji.'},
      {id:'TXN-2047',type:'earning',title:'Plumbing Repair • Amit Verma',date:'12 Aug 2026',method:'Job payment',amount:650,status:'completed',detail:'Payment received for plumbing repair at Dona Paula, Goa.'},
      {id:'TXN-2046',type:'withdraw',title:'Wallet withdrawal',date:'10 Aug 2026',method:'Bank Account •••• 4567',amount:5000,status:'completed',detail:'Withdrawal transferred to the registered bank account.'},
      {id:'TXN-2045',type:'earning',title:'Electrical Inspection • Neha Kapoor',date:'09 Aug 2026',method:'Job payment',amount:1200,status:'completed',detail:'Payment received for electrical inspection.'},
      {id:'TXN-2044',type:'withdraw',title:'Wallet withdrawal',date:'08 Aug 2026',method:'UPI •••• 9012',amount:2500,status:'pending',detail:'Withdrawal is being processed by the payment provider.'},
      {id:'TXN-2043',type:'earning',title:'Switchboard Repair',date:'06 Aug 2026',method:'Job payment',amount:720,status:'completed',detail:'Payment received for switchboard repair.'}
    ]
  };
  const earningsWeek=[{d:'Mon',v:920},{d:'Tue',v:1320},{d:'Wed',v:860},{d:'Thu',v:1480},{d:'Fri',v:1120},{d:'Sat',v:1680},{d:'Sun',v:1040}];
  const earningsMonth=[{d:'W1',v:6400},{d:'W2',v:7820},{d:'W3',v:5240},{d:'W4',v:6340}];
  let state=load();
  let calendarDate=new Date(2026,7,14);
  let selectedDate=keyFor(calendarDate);

  function load(){try{return Object.assign(structuredClone(DEFAULT),JSON.parse(localStorage.getItem(KEY)||'{}'));}catch(e){return structuredClone(DEFAULT)}}
  function save(){localStorage.setItem(KEY,JSON.stringify(state))}
  function money(n){return '₹'+Number(n||0).toLocaleString('en-IN')}
  function keyFor(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
  function dateLabel(key){const d=new Date(key+'T00:00:00');return d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
  function esc(v){return String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[m]))}
  function toast(title,message,type='success'){
    let wrap=document.getElementById('d4ToastWrap');
    if(!wrap){wrap=document.createElement('div');wrap.id='d4ToastWrap';wrap.style.cssText='position:fixed;right:22px;bottom:22px;z-index:10050;display:grid;gap:10px;max-width:min(360px,calc(100vw - 30px));';document.body.appendChild(wrap)}
    const el=document.createElement('div');el.style.cssText='background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:13px 15px;box-shadow:0 18px 45px rgba(15,23,42,.16);display:flex;gap:10px;align-items:flex-start;font-family:inherit;animation:d4Pop .18s ease;';
    const icon=type==='error'?'fa-circle-xmark':type==='warning'?'fa-triangle-exclamation':'fa-circle-check'; const iconColor=type==='error'?'#dc2626':type==='warning'?'#d97706':'#16a34a';
    el.innerHTML=`<i class="fa-solid ${icon}" style="color:${iconColor};margin-top:2px"></i><div><strong style="display:block;color:#172033;font-size:12px">${esc(title)}</strong><span style="display:block;color:#64748b;font-size:10px;line-height:1.5;margin-top:2px">${esc(message)}</span></div>`;wrap.appendChild(el);setTimeout(()=>el.remove(),3500);
  }
  function modal(html){const m=document.getElementById('d4Modal');document.getElementById('d4ModalContent').innerHTML=html;m.classList.add('open');m.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
  function closeModal(){const m=document.getElementById('d4Modal');m.classList.remove('open');m.setAttribute('aria-hidden','true');document.body.style.overflow=''}

  function ensureSelected(){if(!state.availability[selectedDate])state.availability[selectedDate]={available:true,slots:{}};const s=state.availability[selectedDate];for(let h=8;h<=20;h+=2){const k=String(h).padStart(2,'0')+':00';if(!(k in s.slots))s.slots[k]=true}}
  function renderCalendar(){
    const cal=document.getElementById('d4Calendar');if(!cal)return;cal.innerHTML='';
    const y=calendarDate.getFullYear(),m=calendarDate.getMonth();
    document.getElementById('d4CalendarTitle').textContent=calendarDate.toLocaleDateString('en-US',{month:'long',year:'numeric'});
    const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate();
    for(let i=0;i<first;i++){const x=document.createElement('div');x.className='d4-day muted';cal.appendChild(x)}
    for(let day=1;day<=days;day++){
      const d=new Date(y,m,day),key=keyFor(d),data=state.availability[key];const el=document.createElement('button');el.type='button';el.className='d4-day'+(key===selectedDate?' selected':'')+(key===keyFor(new Date(2026,7,14))?' today':'')+(data&&!data.available?' off':'');el.innerHTML=`<span>${day}</span>${data?'<i class="day-dot"></i>':''}`;el.addEventListener('click',()=>{selectedDate=key;ensureSelected();save();renderCalendar();renderSelectedDay()});cal.appendChild(el)}
  }
  function renderSelectedDay(){
    ensureSelected();const data=state.availability[selectedDate];document.getElementById('d4SelectedDate').textContent=dateLabel(selectedDate);const status=document.getElementById('d4AvailabilityStatus');const toggle=document.getElementById('d4ToggleAvailability');
    status.classList.toggle('off',!data.available);status.innerHTML=`<i class="fa-solid fa-circle"></i> ${data.available?'Available':'Unavailable'}`;toggle.textContent=data.available?'Mark Unavailable':'Mark Available';
    const slots=document.getElementById('d4TimeSlots');slots.innerHTML='';let count=0;Object.keys(data.slots).forEach(time=>{if(data.slots[time]&&data.available)count++;const b=document.createElement('button');b.type='button';b.className='d4-slot '+(data.slots[time]&&data.available?'available':'unavailable');b.textContent=time;b.addEventListener('click',()=>{data.slots[time]=!data.slots[time];save();renderSelectedDay()});slots.appendChild(b)});document.getElementById('d4SlotCount').textContent=count+' available';
  }
  function initAvailability(){
    ensureSelected();renderCalendar();renderSelectedDay();
    document.getElementById('d4PrevMonth')?.addEventListener('click',()=>{calendarDate.setMonth(calendarDate.getMonth()-1);renderCalendar()});
    document.getElementById('d4NextMonth')?.addEventListener('click',()=>{calendarDate.setMonth(calendarDate.getMonth()+1);renderCalendar()});
    const todayBtn=document.getElementById('d4TodayBtn'); if(todayBtn) todayBtn.addEventListener('click',()=>{calendarDate=new Date(2026,7,14);selectedDate=keyFor(calendarDate);ensureSelected();save();renderCalendar();renderSelectedDay();document.getElementById('day4')?.scrollIntoView({behavior:'smooth'})});
    document.getElementById('d4ToggleAvailability')?.addEventListener('click',()=>{ensureSelected();state.availability[selectedDate].available=!state.availability[selectedDate].available;save();renderCalendar();renderSelectedDay();toast('Availability updated',dateLabel(selectedDate)+' is now '+(state.availability[selectedDate].available?'available.':'unavailable.'),state.availability[selectedDate].available?'success':'warning')});
  }
  function renderChart(){const mode=document.getElementById('d4ChartRange').value;const data=mode==='month'?earningsMonth:earningsWeek;const chart=document.getElementById('d4EarningsChart');const max=Math.max(...data.map(x=>x.v));chart.innerHTML='';data.forEach(x=>{const g=document.createElement('div');g.className='d4-bar-group';const b=document.createElement('div');b.className='d4-bar';b.style.height=(x.v/max*82)+'%';b.innerHTML=`<span class="d4-bar-value">${money(x.v)}</span><span class="d4-bar-label">${x.d}</span>`;g.appendChild(b);chart.appendChild(g)});const total=data.reduce((a,x)=>a+x.v,0);const best=data.reduce((a,b)=>b.v>a.v?b:a);document.getElementById('d4BestDay').textContent=best.d;document.getElementById('d4AverageDay').textContent=money(Math.round(total/data.length));document.getElementById('d4WeeklyJobs').textContent=mode==='month'?'64':'18'}
  function renderRatings(){const dist=[['5',82],['4',13],['3',3],['2',1],['1',1]];document.getElementById('d4RatingDistribution').innerHTML=dist.map(([n,p])=>`<div class="d4-rating-row"><span>${n}★</span><div class="d4-rating-bar"><i style="width:${p}%"></i></div><strong>${p}%</strong></div>`).join('')}
  function renderWallet(){document.getElementById('d4WalletBalance').textContent=money(state.wallet.balance);document.getElementById('d4TotalEarnings').textContent=money(state.wallet.total);document.getElementById('d4PendingPayout').textContent=money(state.wallet.pending);document.getElementById('d4MonthlyEarnings').textContent=money(25800);document.getElementById('d4WeeklyEarnings').textContent=money(8420)}
  function renderTransactions(){const q=(document.getElementById('d4TransactionSearch').value||'').toLowerCase().trim(),f=document.getElementById('d4TransactionFilter').value;const rows=state.transactions.filter(t=>(f==='all'||t.status===f)&&(!q||[t.id,t.title,t.date,t.method,t.status].join(' ').toLowerCase().includes(q)));const body=document.getElementById('d4TransactionBody');body.innerHTML=rows.map(t=>`<tr><td><div class="d4-tx-main"><div class="d4-tx-icon ${t.type==='withdraw'?'withdraw':''}"><i class="fa-solid ${t.type==='withdraw'?'fa-arrow-up-right':'fa-arrow-down-left'}"></i></div><div><strong>${esc(t.title)}</strong><small style="display:block;color:#94a3b8;font-size:9px">${esc(t.id)}</small></div></div></td><td>${esc(t.date)}</td><td>${esc(t.method)}</td><td><strong>${t.type==='withdraw'?'−':'+'}${money(t.amount)}</strong></td><td><span class="d4-tx-status ${t.status}">${esc(t.status)}</span></td><td><button class="d4-view-btn" data-d4-tx="${esc(t.id)}"><i class="fa-solid fa-eye"></i></button></td></tr>`).join('');document.getElementById('d4TransactionEmpty').hidden=rows.length>0}
  function openWithdraw(){modal(`<span class="day4-label">WALLET WITHDRAWAL</span><h2>Withdraw funds</h2><p>Transfer available earnings to your registered bank account or UPI.</p><div class="d4-wallet-balance"><div><span>Available balance</span><strong>${money(state.wallet.balance)}</strong></div><div class="d4-wallet-chip">Secure</div></div><div class="d4-form-group"><label>Withdrawal Amount</label><input id="d4Amount" type="number" min="100" max="${state.wallet.balance}" step="1" placeholder="Enter amount"><div id="d4AmountError" class="d4-validation"></div></div><div class="d4-form-group"><label>Withdrawal Method</label><select id="d4Method"><option value="Bank Account •••• 4567">Bank Account •••• 4567</option><option value="UPI •••• 9012">UPI •••• 9012</option></select></div><div class="d4-modal-actions"><button class="day4-btn day4-btn-secondary" data-d4-close>Cancel</button><button class="day4-btn day4-btn-primary" id="d4ContinueWithdraw">Review Withdrawal</button></div>`);document.getElementById('d4ContinueWithdraw').addEventListener('click',()=>{const amount=Number(document.getElementById('d4Amount').value),err=document.getElementById('d4AmountError');if(!amount||amount<100){err.textContent='Enter at least ₹100.';return}if(amount>state.wallet.balance){err.textContent='Amount cannot exceed your available balance.';return}const method=document.getElementById('d4Method').value;modal(`<span class="day4-label">CONFIRMATION</span><h2>Confirm withdrawal</h2><p>Please review the transfer details before submitting.</p><div class="d4-tx-detail"><div><span>Amount</span><strong>${money(amount)}</strong></div><div><span>Method</span><strong>${esc(method)}</strong></div><div><span>Processing</span><strong>Usually within 1 business day</strong></div></div><div class="d4-modal-actions"><button class="day4-btn day4-btn-secondary" data-d4-close>Cancel</button><button class="day4-btn day4-btn-primary" id="d4ConfirmWithdraw"><i class="fa-solid fa-shield-check"></i> Confirm Withdrawal</button></div>`);document.getElementById('d4ConfirmWithdraw').addEventListener('click',()=>{state.wallet.balance-=amount;state.transactions.unshift({id:'TXN-'+(2050+state.transactions.length),type:'withdraw',title:'Wallet withdrawal',date:new Date(2026,7,14).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}),method,amount,status:'pending',detail:'Withdrawal submitted and awaiting payment-provider processing.'});save();closeModal();renderWallet();renderTransactions();toast('Withdrawal submitted',money(amount)+' withdrawal is now pending.','success')})})}
  window.openDay4Withdraw = openWithdraw;
  function openTx(id){const t=state.transactions.find(x=>x.id===id);if(!t)return;modal(`<span class="day4-label">TRANSACTION DETAILS</span><h2>${esc(t.title)}</h2><p>${esc(t.detail)}</p><div class="d4-tx-detail"><div><span>Transaction ID</span><strong>${esc(t.id)}</strong></div><div><span>Date</span><strong>${esc(t.date)}</strong></div><div><span>Method</span><strong>${esc(t.method)}</strong></div><div><span>Amount</span><strong>${t.type==='withdraw'?'−':'+'}${money(t.amount)}</strong></div><div><span>Payment Status</span><strong style="text-transform:capitalize">${esc(t.status)}</strong></div></div><div class="d4-modal-actions"><button class="day4-btn day4-btn-primary" data-d4-close>Done</button></div>`)}
  function bind(){
    document.getElementById('d4ChartRange')?.addEventListener('change',renderChart);document.getElementById('d4TransactionSearch')?.addEventListener('input',renderTransactions);document.getElementById('d4TransactionFilter')?.addEventListener('change',renderTransactions);document.getElementById('d4WithdrawBtn')?.addEventListener('click',openWithdraw);document.getElementById('d4WithdrawTop')?.addEventListener('click',openWithdraw);
    document.addEventListener('click',e=>{const close=e.target.closest('[data-d4-close]');if(close)closeModal();const tx=e.target.closest('[data-d4-tx]');if(tx)openTx(tx.getAttribute('data-d4-tx'));});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
  }
  function init(){initAvailability();renderChart();renderRatings();renderWallet();renderTransactions();bind();
    // Keep the Day 4 page available even when older navigation code initializes first.
    const nav=document.querySelector('[data-day4-nav]');if(nav&&typeof window.showPage==='function'){nav.addEventListener('click',()=>setTimeout(()=>window.scrollTo({top:0,behavior:'smooth'}),0))}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
