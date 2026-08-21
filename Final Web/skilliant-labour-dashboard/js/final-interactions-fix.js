/* Final interaction bridge: Day 4 Performance & Finance withdraw */
(function(){
  "use strict";
  function bind(){
    document.addEventListener("click", function(event){
      const button = event.target.closest("#day4WithdrawTop");
      if(!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if(typeof window.openDay4Withdraw === "function") window.openDay4Withdraw();
    }, true);
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind, {once:true});
  else bind();
})();
