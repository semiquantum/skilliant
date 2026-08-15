/* =========================================================
   SKILLIANT LABOUR PORTAL — DAY 5 FINALIZATION
   Profile • Payments • Skills • Experience • Certificates
   Portfolio • Reviews • Settings • Export • Mobile UX
========================================================= */
(function () {
  'use strict';

  const KEY = 'skilliant_day5_profile_v1';
  const DEFAULT = {
    profile: {
      name: 'Rahul Sharma',
      profession: 'Electrician',
      location: 'Panaji, Goa',
      about: 'Experienced electrician with 4+ years of professional experience in residential and commercial electrical services. I focus on reliable work, safety and customer satisfaction.'
    },
    payment: {
      holder: 'Rahul Sharma',
      account: '456789012345',
      ifsc: 'SBIN0001234',
      bank: 'State Bank of India',
      upi: 'rahul@okaxis'
    },
    skills: ['Electrical Wiring','Lighting Installation','AC Repair','Appliance Repair','Home Electrical Maintenance'],
    experience: [
      { id:'exp1', title:'Senior Electrician', company:'Skilliant Services', duration:'2023 - Present', description:'Handling residential electrical installations, maintenance, appliance repairs and customer service.' },
      { id:'exp2', title:'Electrician', company:'Goa Electrical Works', duration:'2021 - 2023', description:'Worked on wiring, lighting systems, electrical maintenance and repair projects.' }
    ],
    certificates: [
      { id:'cert1', name:'Electrical Safety Certification', issuer:'National Skill Development Corporation', date:'2024-03', number:'ESC-2024-0182' },
      { id:'cert2', name:'Professional Electrician', issuer:'Skill India', date:'2023-08', number:'SI-ELEC-8831' },
      { id:'cert3', name:'Workplace Safety Training', issuer:'Safety Training Institute', date:'2023-01', number:'WST-23017' }
    ],
    portfolio: [
      { id:'pro1', title:'Complete Home Wiring', category:'Electrical', description:'Complete electrical wiring and lighting installation for a residential home.', image:'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=80', date:'Jun 2026', rating:'5.0' },
      { id:'pro2', title:'Modern Lighting Setup', category:'Lighting', description:'Decorative and energy-efficient lighting installation for a modern apartment.', image:'https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1000&q=80', date:'May 2026', rating:'4.9' },
      { id:'pro3', title:'Commercial Maintenance', category:'Maintenance', description:'Electrical inspection and preventive maintenance for a commercial property.', image:'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1000&q=80', date:'Apr 2026', rating:'5.0' }
    ],
    settings: {
      jobRequests:true, payments:true, messages:true, twoFactor:false, availability:true, language:'English', privacy:'standard'
    }
  };

  let state = load();
  let editingSkill = null;
  let editingExperience = null;
  let editingCertificate = null;
  let editingProject = null;

  function clone(v){ return JSON.parse(JSON.stringify(v)); }
  function load(){ try { return Object.assign(clone(DEFAULT), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch(e){ return clone(DEFAULT); } }
  function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
  function $(id){ return document.getElementById(id); }
  function esc(v){ return String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function toast(message, type='success'){
    let n = $('day5Notification');
    if(!n){ n=document.createElement('div'); n.id='day5Notification'; n.className='day5-notification'; document.body.appendChild(n); }
    n.innerHTML = `<i class="fa-solid ${type==='error'?'fa-circle-exclamation':'fa-circle-check'}"></i><span>${esc(message)}</span><button aria-label="Close">×</button>`;
    n.classList.add('show');
    clearTimeout(n._timer); n._timer=setTimeout(()=>n.classList.remove('show'),2800);
    n.querySelector('button')?.addEventListener('click',()=>n.classList.remove('show'),{once:true});
  }
  function modal(id, title, body, buttons=''){
    let el=$(id);
    // Some older Day 1 markup already contains #profileEditModal and
    // #portfolioModal. Those legacy elements do not have the Day 5 modal
    // structure, so re-use the id but safely upgrade the element instead of
    // throwing "Cannot set properties of null".
    if(!el){
      el=document.createElement('div');
      el.id=id;
      document.body.appendChild(el);
    }
    if(!el.querySelector('.day5-modal-content')){
      el.className='day5-modal';
      el.innerHTML=`<div class="day5-modal-card" role="dialog" aria-modal="true"><button type="button" class="day5-modal-close" aria-label="Close">×</button><div class="day5-modal-content"></div></div>`;
      if(!el.dataset.day5Bound){
        el.dataset.day5Bound='1';
        el.addEventListener('click',e=>{if(e.target===el||e.target.closest('.day5-modal-close')) closeModal5(id);});
      }
    }
    el.querySelector('.day5-modal-content').innerHTML=`<div class="day5-modal-head"><div><span class="day5-kicker">DAY 5</span><h2>${esc(title)}</h2></div></div>${body}${buttons}`;
    el.classList.add('open');
    el.setAttribute('aria-hidden','false');
    return el;
  }
  function closeModal5(id){ $(id)?.classList.remove('open'); }
  function field(label,id,value='',type='text',required=false,extra=''){
    return `<label class="day5-field"><span>${esc(label)}${required?' *':''}</span><input id="${id}" type="${type}" value="${esc(value)}" ${required?'required':''} ${extra}></label>`;
  }
  function textarea(label,id,value='',required=false){ return `<label class="day5-field"><span>${esc(label)}${required?' *':''}</span><textarea id="${id}" rows="4" ${required?'required':''}>${esc(value)}</textarea></label>`; }
  function select(label,id,options,value){ return `<label class="day5-field"><span>${esc(label)}</span><select id="${id}">${options.map(o=>`<option value="${esc(o)}" ${o===value?'selected':''}>${esc(o)}</option>`).join('')}</select></label>`; }
  function actions(saveText='Save Changes'){ return `<div class="day5-modal-actions"><button type="button" class="day5-btn ghost" data-day5-close>Cancel</button><button type="button" class="day5-btn primary" data-day5-save>${esc(saveText)}</button></div>`; }

  function bindModalDelegation(){
    document.addEventListener('click',e=>{
      const close=e.target.closest('[data-day5-close]'); if(close){ const m=close.closest('.day5-modal'); if(m) closeModal5(m.id); }
      const saveBtn=e.target.closest('[data-day5-save]'); if(saveBtn){ const fn=saveBtn.dataset.day5Save; if(fn && typeof window[fn]==='function') window[fn](); }
    });
  }

  function renderProfile(){
    const name=document.querySelector('.profile-information h2'); if(name) name.textContent=state.profile.name;
    const role=document.querySelector('.profile-role'); if(role) role.innerHTML=`<i class="fa-solid fa-bolt"></i> ${esc(state.profile.profession)}`;
    const loc=document.querySelector('.profile-location'); if(loc) loc.innerHTML=`<i class="fa-solid fa-location-dot"></i> ${esc(state.profile.location)}`;
    const about=document.querySelector('.about-text'); if(about) about.textContent=state.profile.about;
    renderSkills(); renderExperience(); renderPaymentPanel();
  }
  function renderSkills(){
    const c=document.querySelector('.skills-container'); if(!c) return;
    c.innerHTML=state.skills.map((s,i)=>`<span class="skill-tag" data-skill-index="${i}"><i class="fa-solid fa-circle-check"></i>${esc(s)}<button type="button" class="day5-inline-edit" data-edit-skill="${i}" aria-label="Edit skill">✎</button><button type="button" class="day5-inline-delete" data-delete-skill="${i}" aria-label="Delete skill">×</button></span>`).join('');
  }
  function renderExperience(){
    const c=document.querySelector('.experience-timeline'); if(!c) return;
    c.innerHTML=state.experience.length ? state.experience.map(x=>`<div class="experience-item day5-manage-card"><div class="experience-icon"><i class="fa-solid fa-briefcase"></i></div><div class="experience-content"><div class="experience-heading"><div><h4>${esc(x.title)}</h4><p>${esc(x.company)}</p></div><span>${esc(x.duration)}</span></div><p>${esc(x.description)}</p><div class="day5-card-actions"><button data-edit-experience="${esc(x.id)}">Edit</button><button data-delete-experience="${esc(x.id)}">Delete</button></div></div></div>`).join('') : `<div class="day5-empty">No work experience added yet.</div>`;
  }
  function renderPaymentPanel(){
    let panel=$('day5PaymentPanel');
    const host=document.querySelector('#profilePage .profile-main') || document.querySelector('#profilePage');
    if(!host) return;
    if(!panel){ panel=document.createElement('section'); panel.id='day5PaymentPanel'; panel.className='day5-payment-panel'; host.appendChild(panel); }
    panel.innerHTML=`<div class="day5-section-title"><div><span>PAYMENT DETAILS</span><h3>Bank & UPI Details</h3><p>Keep your payout information ready for job earnings and withdrawals.</p></div><button class="day5-btn primary" type="button" id="day5EditPayment"><i class="fa-solid fa-pen"></i> Edit Details</button></div><div class="day5-payment-grid"><div class="day5-payment-card"><span>Bank Account</span><strong>${esc(state.payment.bank)}</strong><small>Holder: ${esc(state.payment.holder)}</small><small>Account: •••• ${esc(state.payment.account.slice(-4))}</small><small>IFSC: ${esc(state.payment.ifsc)}</small></div><div class="day5-payment-card"><span>UPI</span><strong>${esc(state.payment.upi)}</strong><small>Verified payment ID</small><small>Ready for instant withdrawals</small></div></div>`;
    $('day5EditPayment')?.addEventListener('click',openPaymentModal);
  }

  window.openProfileEditModal=function(){
    const body=`<div class="day5-form-grid">${field('Full Name','d5ProfileName',state.profile.name,'text',true)}${field('Profession','d5ProfileProfession',state.profile.profession,'text',true)}${field('Location','d5ProfileLocation',state.profile.location,'text',true)}${textarea('About','d5ProfileAbout',state.profile.about,true)}</div>`;
    const m=modal('day5ProfileModal','Edit Profile',body,actions('Save Profile')); m.querySelector('[data-day5-save]')?.setAttribute('data-day5-save','saveDay5Profile');
  };
  window.saveDay5Profile=function(){
    const name=$('d5ProfileName')?.value.trim(), profession=$('d5ProfileProfession')?.value.trim(), location=$('d5ProfileLocation')?.value.trim(), about=$('d5ProfileAbout')?.value.trim();
    if(!name||!profession||!location||!about){toast('Please complete all profile fields.','error');return;}
    state.profile={name,profession,location,about}; save(); renderProfile(); closeModal5('day5ProfileModal'); toast('Profile updated successfully!');
  };

  function openPaymentModal(){
    const body=`<div class="day5-form-grid">${field('Account Holder Name','d5BankHolder',state.payment.holder,'text',true)}${field('Account Number','d5Account',state.payment.account,'text',true,'minlength="8" inputmode="numeric"')}${field('IFSC Code','d5Ifsc',state.payment.ifsc,'text',true,'pattern="^[A-Za-z]{4}0[A-Za-z0-9]{6}$"')}${field('Bank Name','d5Bank',state.payment.bank,'text',true)}${field('UPI ID','d5Upi',state.payment.upi,'text',true,'pattern="^[a-zA-Z0-9._-]{2,}@[a-zA-Z]{2,}$"')}</div><p class="day5-form-note">Your account number and UPI ID are stored only in this browser for this frontend demo.</p>`;
    const m=modal('day5PaymentModal','Bank & UPI Details',body,actions('Save Payment Details')); m.querySelector('[data-day5-save]')?.setAttribute('data-day5-save','savePaymentDetails');
  }
  window.savePaymentDetails=function(){
    const holder=$('d5BankHolder')?.value.trim(), account=$('d5Account')?.value.trim(), ifsc=$('d5Ifsc')?.value.trim().toUpperCase(), bank=$('d5Bank')?.value.trim(), upi=$('d5Upi')?.value.trim();
    if(!holder||!bank||!account||!/^\d{8,20}$/.test(account)||!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(ifsc)||!/^.+@[A-Za-z]{2,}$/.test(upi)){toast('Please enter valid bank and UPI details.','error');return;}
    state.payment={holder,account,ifsc,bank,upi}; save(); renderPaymentPanel(); closeModal5('day5PaymentModal'); toast('Payment details updated successfully!');
  };

  window.openSkillsModal=function(){
    editingSkill=null;
    const body=field('Skill Name','d5Skill','', 'text',true);
    const m=modal('skillsModal','Add Skill',body,actions('Add Skill')); m.querySelector('[data-day5-save]')?.setAttribute('data-day5-save','saveSkill');
  };
  window.saveSkill=function(){
    const v=$('d5Skill')?.value.trim(); if(!v){toast('Enter a skill name.','error');return;}
    if(state.skills.some((s,i)=>s.toLowerCase()===v.toLowerCase() && i!==editingSkill)){toast('That skill already exists.','error');return;}
    if(editingSkill===null) state.skills.push(v); else state.skills[editingSkill]=v;
    save(); renderSkills(); closeModal5('skillsModal'); toast(editingSkill===null?'Skill added successfully!':'Skill updated successfully!');
  };

  window.openExperienceModal=function(id){
    editingExperience=id||null; const x=state.experience.find(v=>v.id===id);
    const body=`<div class="day5-form-grid">${field('Job Title','d5ExpTitle',x?.title||'','text',true)}${field('Company','d5ExpCompany',x?.company||'','text',true)}${field('Duration','d5ExpDuration',x?.duration||'','text',true)}${textarea('Experience Details','d5ExpDescription',x?.description||'',true)}</div>`;
    const m=modal('experienceModal',id?'Edit Experience':'Add Experience',body,actions(id?'Save Experience':'Add Experience')); m.querySelector('[data-day5-save]')?.setAttribute('data-day5-save','saveExperience');
  };
  window.saveExperience=function(){
    const title=$('d5ExpTitle')?.value.trim(), company=$('d5ExpCompany')?.value.trim(), duration=$('d5ExpDuration')?.value.trim(), description=$('d5ExpDescription')?.value.trim();
    if(!title||!company||!duration||!description){toast('Please complete all experience fields.','error');return;}
    const x={id:editingExperience||('exp'+Date.now()),title,company,duration,description}; if(editingExperience){const i=state.experience.findIndex(v=>v.id===editingExperience);state.experience[i]=x;}else state.experience.unshift(x); save();renderExperience();closeModal5('experienceModal');toast(editingExperience?'Experience updated successfully!':'Experience added successfully!');editingExperience=null;
  };

  window.openCertificateModal=function(id){
    editingCertificate=id||null; const c=state.certificates.find(v=>v.id===id);
    const body=`<div class="day5-form-grid">${field('Certificate Name','d5CertName',c?.name||'','text',true)}${field('Issuing Organization','d5CertIssuer',c?.issuer||'','text',true)}${field('Issue Date','d5CertDate',c?.date||'','month',true)}${field('Certificate ID','d5CertNumber',c?.number||'','text',false)}</div><div class="day5-preview-box"><i class="fa-solid fa-certificate"></i><span>Preview updates after saving.</span></div>`;
    const m=modal('certificateModal',id?'Edit Certificate':'Add Certificate',body,actions(id?'Save Certificate':'Add Certificate')); m.querySelector('[data-day5-save]')?.setAttribute('data-day5-save','saveCertificate');
  };
  window.saveCertificate=function(){
    const name=$('d5CertName')?.value.trim(),issuer=$('d5CertIssuer')?.value.trim(),date=$('d5CertDate')?.value,number=$('d5CertNumber')?.value.trim();
    if(!name||!issuer||!date){toast('Certificate name, organization and issue date are required.','error');return;}
    const c={id:editingCertificate||('cert'+Date.now()),name,issuer,date,number}; if(editingCertificate){const i=state.certificates.findIndex(v=>v.id===editingCertificate);state.certificates[i]=c;}else state.certificates.unshift(c); save();renderCertificates();closeModal5('certificateModal');toast(editingCertificate?'Certificate updated successfully!':'Certificate added successfully!');editingCertificate=null;
  };
  function formatMonth(v){if(!v)return '';const [y,m]=v.split('-');return new Date(Number(y),Number(m)-1,1).toLocaleString('en-US',{month:'long',year:'numeric'});}
  function renderCertificates(){
    const g=document.querySelector('.certificate-grid');if(!g)return;
    g.innerHTML=state.certificates.length?state.certificates.map(c=>`<article class="certificate-card glass day5-managed-card"><div class="certificate-icon"><i class="fa-solid fa-certificate"></i></div><div class="certificate-content"><h3>${esc(c.name)}</h3><p>${esc(c.issuer)}</p><span>Issued: ${esc(formatMonth(c.date))}</span>${c.number?`<small>ID: ${esc(c.number)}</small>`:''}</div><div class="day5-card-actions vertical"><button data-preview-certificate="${esc(c.id)}"><i class="fa-solid fa-eye"></i></button><button data-edit-certificate="${esc(c.id)}"><i class="fa-solid fa-pen"></i></button><button data-delete-certificate="${esc(c.id)}"><i class="fa-solid fa-trash"></i></button></div></article>`).join(''):`<div class="day5-empty">No certificates added yet. Click Add Certificate to create one.</div>`;
  }
  function previewCertificate(id){const c=state.certificates.find(v=>v.id===id);if(!c)return;const body=`<div class="certificate-preview"><div class="certificate-preview-badge"><i class="fa-solid fa-award"></i></div><h3>${esc(c.name)}</h3><p>Issued by <strong>${esc(c.issuer)}</strong></p><p>Issue date: ${esc(formatMonth(c.date))}</p>${c.number?`<p>Certificate ID: ${esc(c.number)}</p>`:''}<div class="certificate-preview-seal">VERIFIED</div></div>`;modal('day5CertificatePreview','Certificate Preview',body,`<div class="day5-modal-actions"><button class="day5-btn primary" data-day5-close>Close Preview</button></div>`);}

  window.openPortfolioModal=function(id){
    editingProject=id||null;const p=state.portfolio.find(v=>v.id===id);
    const body=`<div class="day5-form-grid">${field('Project Title','d5ProjectTitle',p?.title||'','text',true)}${select('Category','d5ProjectCategory',['Electrical','Lighting','Maintenance','AC Repair','Plumbing','Other'],p?.category||'Electrical')}${textarea('Project Description','d5ProjectDescription',p?.description||'',true)}${field('Project Image URL','d5ProjectImage',p?.image||'','url',false)}</div><label class="day5-field"><span>Project Image File</span><input id="d5ProjectFile" type="file" accept="image/*"><small>Use a local image or paste an image URL.</small></label><div id="d5ProjectPreview" class="project-image-preview">${p?.image?`<img src="${esc(p.image)}" alt="Project preview">`: '<span>Image preview</span>'}</div>`;
    const m=modal('portfolioModal',id?'Edit Portfolio Project':'Add Portfolio Project',body,actions(id?'Save Project':'Add Project')); m.querySelector('[data-day5-save]')?.setAttribute('data-day5-save','savePortfolioProject');
    const file=$('d5ProjectFile'); file?.addEventListener('change',()=>{const f=file.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('d5ProjectPreview').innerHTML=`<img src="${r.result}" alt="Project preview">`; $('d5ProjectPreview').dataset.dataUrl=r.result;};r.readAsDataURL(f);});
  };
  window.savePortfolioProject=function(){
    const title=$('d5ProjectTitle')?.value.trim(),category=$('d5ProjectCategory')?.value,description=$('d5ProjectDescription')?.value.trim(),url=$('d5ProjectImage')?.value.trim(),preview=$('d5ProjectPreview');
    if(!title||!description){toast('Project title and description are required.','error');return;}
    const image=preview?.dataset.dataUrl||url||'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1000&q=80';
    const p={id:editingProject||('pro'+Date.now()),title,category,description,image,date:editingProject?(state.portfolio.find(v=>v.id===editingProject)?.date||'Aug 2026'):new Date().toLocaleString('en-US',{month:'short',year:'numeric'}),rating:editingProject?(state.portfolio.find(v=>v.id===editingProject)?.rating||'New'):'New'};
    if(editingProject){const i=state.portfolio.findIndex(v=>v.id===editingProject);state.portfolio[i]=p;}else state.portfolio.unshift(p);save();renderPortfolio();closeModal5('portfolioModal');toast(editingProject?'Project updated successfully!':'Project added successfully!');editingProject=null;
  };
  function renderPortfolio(){
    const g=document.querySelector('.portfolio-grid');if(!g)return;
    g.innerHTML=state.portfolio.length?state.portfolio.map(p=>`<article class="portfolio-card glass day5-managed-card"><div class="portfolio-image-wrap"><img src="${esc(p.image)}" alt="${esc(p.title)}" onerror="this.style.display='none'"></div><div class="portfolio-content"><span class="portfolio-category">${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><div class="portfolio-footer"><span><i class="fa-solid fa-calendar"></i>${esc(p.date)}</span><span><i class="fa-solid fa-star"></i>${esc(p.rating)}</span></div><div class="day5-card-actions"><button data-edit-project="${esc(p.id)}">Edit</button><button data-delete-project="${esc(p.id)}">Delete</button><button data-preview-project="${esc(p.id)}">Details</button></div></div></article>`).join(''):`<div class="day5-empty">Your portfolio is empty. Add your first project to showcase your work.</div>`;
  }

  function confirmDelete(type,id){
    const labels={skill:'skill',experience:'work experience',certificate:'certificate',project:'portfolio project'};
    const body=`<div class="day5-confirm"><div class="day5-danger-icon"><i class="fa-solid fa-trash"></i></div><h3>Delete ${labels[type]}?</h3><p>This action cannot be undone.</p></div>`;
    const m=modal('day5DeleteModal','Confirm Delete',body,`<div class="day5-modal-actions"><button class="day5-btn ghost" data-day5-close>Cancel</button><button class="day5-btn danger" id="day5ConfirmDelete">Delete</button></div>`);
    $('day5ConfirmDelete').onclick=()=>{ if(type==='skill')state.skills.splice(Number(id),1); if(type==='experience')state.experience=state.experience.filter(x=>x.id!==id); if(type==='certificate')state.certificates=state.certificates.filter(x=>x.id!==id); if(type==='project')state.portfolio=state.portfolio.filter(x=>x.id!==id); save();renderProfile();renderCertificates();renderPortfolio();closeModal5('day5DeleteModal');toast(labels[type].replace(/^./,x=>x.toUpperCase())+' deleted successfully!'); };
  }

  function injectPaymentButtonToWallet(){
    const wallet=document.querySelector('#wallet');if(!wallet||$('day5WalletPayment'))return;
    const panel=document.createElement('div');panel.id='day5WalletPayment';panel.className='day5-payment-panel wallet-payment-panel';panel.innerHTML=`<div class="day5-section-title"><div><span>PAYMENT PROFILE</span><h3>Bank & UPI Details</h3><p>Used for withdrawals and job payouts.</p></div><button class="day5-btn secondary" id="day5WalletEditPayment">Edit Details</button></div><div class="day5-payment-grid"><div class="day5-payment-card"><span>Bank</span><strong id="d5WalletBank"></strong><small id="d5WalletAccount"></small><small id="d5WalletIfsc"></small></div><div class="day5-payment-card"><span>UPI</span><strong id="d5WalletUpi"></strong><small>Verified payment ID</small></div></div>`;
    wallet.appendChild(panel);$('day5WalletEditPayment').onclick=openPaymentModal;updateWalletPayment();
  }
  function updateWalletPayment(){if($('d5WalletBank')){$('d5WalletBank').textContent=state.payment.bank;$('d5WalletAccount').textContent='Account •••• '+state.payment.account.slice(-4);$('d5WalletIfsc').textContent='IFSC '+state.payment.ifsc;$('d5WalletUpi').textContent=state.payment.upi;}}

  window.saveEmail=function(){const email=$('d5Email')?.value.trim();if(!email||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){toast('Enter a valid email address.','error');return;}closeModal5('day5EmailModal');toast('Email address updated successfully!');};
  window.savePassword=function(){const a=$('d5CurrentPassword')?.value,b=$('d5NewPassword')?.value,c=$('d5ConfirmPassword')?.value;if(!a||!b||b.length<8||b!==c){toast('Use an 8+ character password and confirm it correctly.','error');return;}closeModal5('day5PasswordModal');toast('Password updated successfully!');};

  function injectSettings(){
    const page=$('settings');if(!page||$('day5SettingsExtra'))return;
    const sec=document.createElement('section');sec.id='day5SettingsExtra';sec.className='day5-settings-grid';sec.innerHTML=`
      <article class="day5-setting-card"><div><span>ACCOUNT SETTINGS</span><h3>Profile & Payment</h3><p>Update professional profile and payout details.</p></div><div class="day5-setting-actions"><button class="day5-btn secondary" id="d5SettingsProfile">Edit Profile</button><button class="day5-btn secondary" id="d5SettingsPayment">Payment Details</button></div></article>
      <article class="day5-setting-card"><div><span>NOTIFICATION SETTINGS</span><h3>Stay informed</h3><p>Choose which portal events should send alerts.</p></div><div class="day5-switch-list"><label>Job Requests <input type="checkbox" data-setting="jobRequests" ${state.settings.jobRequests?'checked':''}></label><label>Payment Updates <input type="checkbox" data-setting="payments" ${state.settings.payments?'checked':''}></label><label>Customer Messages <input type="checkbox" data-setting="messages" ${state.settings.messages?'checked':''}></label></div></article>
      <article class="day5-setting-card"><div><span>PRIVACY & SECURITY</span><h3>Account protection</h3><p>Control security and privacy preferences.</p></div><div class="day5-switch-list"><label>Two-Factor Authentication <input type="checkbox" data-setting="twoFactor" ${state.settings.twoFactor?'checked':''}></label><select id="d5Privacy"><option value="standard">Standard Privacy</option><option value="private">Private Profile</option></select></div></article>
      <article class="day5-setting-card"><div><span>APPEARANCE</span><h3>Dark / Light Mode</h3><p>Match the portal to your preferred working environment.</p></div><button class="day5-btn secondary" id="d5Appearance">Toggle Appearance</button></article>
      <article class="day5-setting-card"><div><span>SESSION</span><h3>Logout</h3><p>End this portal session.</p></div><button class="day5-btn danger" id="d5Logout"><i class="fa-solid fa-right-from-bracket"></i> Logout</button></article>`;
    page.appendChild(sec);
    $('d5SettingsProfile').onclick=window.openProfileEditModal;$('d5SettingsPayment').onclick=openPaymentModal;$('d5Logout').onclick=()=>{if(typeof window.openLogoutModal==='function')window.openLogoutModal();else toast('Logout requested');};
    sec.addEventListener('change',e=>{const k=e.target.dataset.setting;if(k){state.settings[k]=e.target.checked;save();toast(e.target.checked?'Setting enabled':'Setting disabled');}if(e.target.id==='d5Privacy'){state.settings.privacy=e.target.value;save();toast('Privacy setting updated');}});
    $('d5Appearance').onclick=()=>{const cur=document.documentElement.getAttribute('data-theme')||'light';const next=cur==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',next);localStorage.setItem('skilliant_theme',next);toast(next==='dark'?'Dark mode enabled':'Light mode enabled');};
  }

  function enhanceReviews(){
    const page=$('reviews');if(!page||$('day5ReviewHistory'))return;
    const wrap=document.createElement('section');wrap.id='day5ReviewHistory';wrap.className='day5-review-history';wrap.innerHTML=`<div class="day5-section-title"><div><span>REVIEW HISTORY</span><h3>Customer Feedback</h3><p>Recent ratings and comments from completed jobs.</p></div><span class="day5-rating-pill"><i class="fa-solid fa-star"></i> 4.8 / 5</span></div><div class="day5-review-list"><article><div class="day5-stars">★★★★★</div><strong>Priya Mehta</strong><span>2 days ago</span><p>Excellent service! Rahul arrived on time, explained everything clearly and completed the electrical work perfectly.</p></article><article><div class="day5-stars">★★★★★</div><strong>Amit Verma</strong><span>1 week ago</span><p>Very professional and knowledgeable. The problem was identified quickly and the repair was completed neatly.</p></article></div><div class="day5-empty review-empty" hidden>No customer reviews yet. Completed jobs will appear here.</div>`;page.appendChild(wrap);
  }

  function exportReport(){
    const rows=[['Skilliant Labour Portal','Day 5 Final Report'],['Profile',state.profile.name],['Profession',state.profile.profession],['Location',state.profile.location],['Monthly Earnings','25800'],['Completed Jobs','126'],['Customer Rating','4.8'],[],['Skills',''],...state.skills.map(s=>['Skill',s]),[],['Certificates','',''],...state.certificates.map(c=>['Certificate',c.name,c.issuer,formatMonth(c.date)]),[],['Portfolio','',''],...state.portfolio.map(p=>['Project',p.title,p.category,p.date]),[],['Payment Details','Bank',state.payment.bank],['Payment Details','UPI',state.payment.upi]];
    const csv=rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`skilliant-labour-report-${new Date().toISOString().slice(0,10)}.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('Report exported successfully!');
  }

  function bindGlobal(){
    document.addEventListener('click',e=>{
      const editSkill=e.target.closest('[data-edit-skill]');if(editSkill){editingSkill=Number(editSkill.dataset.editSkill);const v=state.skills[editingSkill];const m=modal('skillsModal','Edit Skill',field('Skill Name','d5Skill',v,'text',true),actions('Save Skill'));m.querySelector('[data-day5-save]').setAttribute('data-day5-save','saveSkill');}
      const delSkill=e.target.closest('[data-delete-skill]');if(delSkill)confirmDelete('skill',delSkill.dataset.deleteSkill);
      const editExp=e.target.closest('[data-edit-experience]');if(editExp)window.openExperienceModal(editExp.dataset.editExperience);
      const delExp=e.target.closest('[data-delete-experience]');if(delExp)confirmDelete('experience',delExp.dataset.deleteExperience);
      const editCert=e.target.closest('[data-edit-certificate]');if(editCert)window.openCertificateModal(editCert.dataset.editCertificate);
      const delCert=e.target.closest('[data-delete-certificate]');if(delCert)confirmDelete('certificate',delCert.dataset.deleteCertificate);
      const previewCert=e.target.closest('[data-preview-certificate]');if(previewCert)previewCertificate(previewCert.dataset.previewCertificate);
      const editProj=e.target.closest('[data-edit-project]');if(editProj)window.openPortfolioModal(editProj.dataset.editProject);
      const delProj=e.target.closest('[data-delete-project]');if(delProj)confirmDelete('project',delProj.dataset.deleteProject);
      const previewProj=e.target.closest('[data-preview-project]');if(previewProj){const p=state.portfolio.find(v=>v.id===previewProj.dataset.previewProject);if(p)modal('day5ProjectPreview','Project Details',`<div class="project-detail-preview"><img src="${esc(p.image)}" alt="${esc(p.title)}"><span>${esc(p.category)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p><small>${esc(p.date)} • Rating ${esc(p.rating)}</small></div>`,`<div class="day5-modal-actions"><button class="day5-btn primary" data-day5-close>Close</button></div>`);}
      if(e.target.closest('#analyticsExportBtn')){e.preventDefault();exportReport();}
      const exportBtn=e.target.closest('#analytics .primary-btn');if(exportBtn && /export report/i.test(exportBtn.textContent||'')){e.preventDefault();exportReport();}
      const viewAll=e.target.closest('.view-all');if(viewAll){e.preventDefault();window.showPage?.('jobs',document.querySelector('.menu li[onclick*="showPage(\'jobs\'"]'));}
      const walletEdit=e.target.closest('#wallet .edit-btn');if(walletEdit){e.preventDefault();openPaymentModal();}
      const settingChange=e.target.closest('#settings .settings-card .edit-btn');if(settingChange){e.preventDefault();const row=settingChange.closest('.settings-row');const label=row?.querySelector('strong')?.textContent?.trim()||'';if(/Email Address/i.test(label)){const body=field('Email Address','d5Email','rahul.sharma@example.com','email',true);const m=modal('day5EmailModal','Change Email Address',body,actions('Save Email'));m.querySelector('[data-day5-save]').setAttribute('data-day5-save','saveEmail');}else if(/Change Password/i.test(label)){const body=`${field('Current Password','d5CurrentPassword','','password',true)}${field('New Password','d5NewPassword','','password',true,'minlength=\"8\"')}${field('Confirm Password','d5ConfirmPassword','','password',true,'minlength=\"8\"')}`;const m=modal('day5PasswordModal','Change Password',body,actions('Update Password'));m.querySelector('[data-day5-save]').setAttribute('data-day5-save','savePassword');}}
      if(e.target.closest('#d5MobileMenuToggle'))toggleMobile();
      if(e.target.closest('#d5MobileOverlay'))toggleMobile(false);
      const menuItem=e.target.closest('.sidebar .menu li');if(window.innerWidth<=767 && menuItem && !menuItem.dataset.keepOpen) setTimeout(()=>toggleMobile(false),50);
    },true);
  }

  function setupMobile(){
    if($('d5MobileMenuToggle'))return;
    const btn=document.createElement('button');btn.id='d5MobileMenuToggle';btn.className='d5-mobile-toggle';btn.setAttribute('aria-label','Open navigation');btn.innerHTML='<i class="fa-solid fa-bars"></i>';
    const overlay=document.createElement('div');overlay.id='d5MobileOverlay';overlay.className='d5-mobile-overlay';
    document.body.append(btn,overlay);
    window.addEventListener('resize',()=>{if(window.innerWidth>767){document.body.classList.remove('d5-mobile-menu-open');document.querySelector('.sidebar')?.classList.remove('d5-open');}});
  }
  function toggleMobile(open){const sidebar=document.querySelector('.sidebar');const should=open===undefined?!document.body.classList.contains('d5-mobile-menu-open'):open;document.body.classList.toggle('d5-mobile-menu-open',should);sidebar?.classList.toggle('d5-open',should);}
  window.toggleDay5Mobile=toggleMobile;

  function init(){
    bindModalDelegation();bindGlobal();setupMobile();
    renderProfile();renderCertificates();renderPortfolio();injectPaymentButtonToWallet();updateWalletPayment();injectSettings();enhanceReviews();
    const exportButton=document.querySelector('#analytics .primary-btn');if(exportButton && /export report/i.test(exportButton.textContent||'')){exportButton.id='analyticsExportBtn';exportButton.type='button';}
    // Fix logout button in the existing modal.
    document.querySelector('#logoutModal .danger-btn')?.addEventListener('click',()=>{localStorage.setItem('skilliant_logged_out','true');closeModal('logoutModal');toast('Logged out successfully.');});
    console.log('✓ Day 5 profile, payments, portfolio, reviews and settings module ready');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
