/* FINAL RELIABILITY PATCH — Withdrawal + Red/Violet Design System */
(function(){
  'use strict';
  function bind(){
    const selectors=['#day4WithdrawTop','#d4WithdrawTop','#d4WithdrawBtn'];
    selectors.forEach(sel=>{
      const el=document.querySelector(sel);
      if(!el || el.dataset.finalWithdrawBound==='1') return;
      el.dataset.finalWithdrawBound='1';
      el.type='button';
      el.removeAttribute('onclick');
      el.addEventListener('click',function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        if(typeof window.skilliantOpenWithdraw==='function'){
          window.skilliantOpenWithdraw();
        } else if(typeof window.openDay4Withdraw==='function'){
          window.openDay4Withdraw();
        } else if(typeof window.openWithdrawModal==='function'){
          window.openWithdrawModal();
        }
      }, true);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind,{once:false});
  else bind();
  setTimeout(bind,100);
  setTimeout(bind,500);
})();
