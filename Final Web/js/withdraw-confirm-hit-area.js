/* =========================================================
   SKILLIANT — WITHDRAW CONFIRM HIT-AREA PATCH
   Guarantees the complete visible Confirm Withdrawal button
   responds, even if a legacy overlay captures part of its area.
========================================================= */
(function(){
  'use strict';

  function getConfirm(){
    return document.querySelector('#d4Modal [data-root-confirm]');
  }

  function invoke(e){
    const btn=getConfirm();
    if(!btn) return false;

    // Prefer the real root controller so transaction state/history remains
    // in the same single source of truth.
    const run=window.skilliantRootConfirmWithdrawal;
    if(typeof run==='function'){
      run();
      return true;
    }

    // Fallback: trigger the button's own click handlers.
    btn.click();
    return true;
  }

  function inside(el,e){
    if(!el || !e) return false;
    const r=el.getBoundingClientRect();
    if(!r.width || !r.height) return false;
    return e.clientX>=r.left && e.clientX<=r.right &&
           e.clientY>=r.top && e.clientY<=r.bottom;
  }

  function bind(){
    if(document.documentElement.dataset.withdrawHitPatch==='1') return;
    document.documentElement.dataset.withdrawHitPatch='1';

    // Direct listener: normal path.
    document.addEventListener('click',function(e){
      const btn=getConfirm();
      if(!btn) return;
      if(e.target===btn || btn.contains(e.target)){
        e.preventDefault();
        e.stopImmediatePropagation();
        invoke(e);
      }
    },true);

    // Hit-test path: if another element is physically sitting over part
    // of the visible button, document capture still receives the click and
    // routes it to the complete button rectangle.
    document.addEventListener('click',function(e){
      const btn=getConfirm();
      if(!btn || !inside(btn,e)) return;
      if(e.__skilliantWithdrawHandled) return;
      e.__skilliantWithdrawHandled=true;
      e.preventDefault();
      e.stopImmediatePropagation();
      invoke(e);
    },true);

    // Keep the whole visual button as one predictable hit area.
    const observer=new MutationObserver(function(){
      const btn=getConfirm();
      if(!btn) return;
      btn.type='button';
      btn.style.pointerEvents='auto';
      btn.style.position='relative';
      btn.style.zIndex='999999';
      btn.style.cursor='pointer';
      btn.style.userSelect='none';
      btn.style.webkitUserSelect='none';
      btn.setAttribute('aria-label','Confirm Withdrawal');
    });
    const modal=document.getElementById('d4Modal');
    if(modal) observer.observe(modal,{subtree:true,childList:true});
  }

  // Expose a stable function for the hit-test controller.
  window.skilliantRootConfirmWithdrawal=function(){
    const fn=window.skilliantRootWithdrawConfirm;
    if(typeof fn==='function') return fn();
    const btn=getConfirm();
    if(btn && typeof btn._rootConfirm==='function') return btn._rootConfirm();
    // Last fallback: activate the button once.
    if(btn) return btn.click();
  };

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',bind,{once:true});
  }else{
    bind();
  }
})();
