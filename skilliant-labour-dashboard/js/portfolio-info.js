(function(){
  'use strict';
  function add(){
    const page=document.getElementById('portfolio'); if(!page||document.getElementById('portfolioProfessionalInfo'))return;
    const grid=page.querySelector('.portfolio-grid'); if(!grid)return;
    const s=document.createElement('section'); s.id='portfolioProfessionalInfo'; s.className='portfolio-professional-info';
    s.innerHTML='<div class="portfolio-info-head"><div><span>PROFESSIONAL SHOWCASE</span><h3>Work quality, scope & expertise</h3><p>Selected projects demonstrate practical electrical installation, lighting and preventive-maintenance experience.</p></div><div class="portfolio-info-badge"><i class="fa-solid fa-shield-check"></i> Verified professional</div></div><div class="portfolio-info-stats"><article><strong>125+</strong><span>Jobs completed</span></article><article><strong>4.8 / 5</strong><span>Customer rating</span></article><article><strong>4+ yrs</strong><span>Field experience</span></article><article><strong>98%</strong><span>On-time completion</span></article></div><div class="portfolio-info-columns"><article><h4><i class="fa-solid fa-bolt"></i> Core services</h4><div class="portfolio-tags"><span>Electrical Wiring</span><span>Lighting Installation</span><span>Fault Diagnosis</span><span>Preventive Maintenance</span><span>Switchboard Repair</span><span>Safety Inspection</span></div></article><article><h4><i class="fa-solid fa-list-check"></i> Project standards</h4><ul><li>Clear scope and material planning before work begins</li><li>Safety-first installation and testing</li><li>Clean handover with customer walkthrough</li><li>Post-job support and maintenance guidance</li></ul></article></div>';
    page.insertBefore(s,grid);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',add);else add();
})();
