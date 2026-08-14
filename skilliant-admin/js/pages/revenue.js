/** Data-driven Revenue Dashboard — existing UI structure preserved. */
const RevenuePage = {
    state:{months:6},
    render(){
        const f=DataService.getFinancialSnapshot();
        const fmt=n=>`$${n.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}`;
        const kpi=[
            {title:'Gross Revenue',value:fmt(f.gross),subtext:'Completed payments',trendUp:true,icon:'fa-solid fa-dollar-sign',colorClass:'kpi-icon-green'},
            {title:'Platform Commission',value:fmt(f.commission),subtext:'Commission earned',trendUp:true,icon:'fa-solid fa-wallet',colorClass:'kpi-icon-blue'},
            {title:'Net Revenue',value:fmt(f.net),subtext:'After commission & refunds',trendUp:true,icon:'fa-solid fa-chart-line',colorClass:'kpi-icon-orange'},
            {title:'Pending Payouts',value:fmt(f.pendingPayouts),subtext:'Awaiting release',trendUp:false,icon:'fa-solid fa-clock',colorClass:'kpi-icon-gold'}
        ];
        const periodSelect=`<select id="revenuePeriod" class="form-control" style="min-width:150px;" onchange="RevenuePage.changePeriod(this.value)"><option value="3" ${this.state.months===3?'selected':''}>3 Months</option><option value="6" ${this.state.months===6?'selected':''}>6 Months</option><option value="12" ${this.state.months===12?'selected':''}>12 Months</option></select>`;
        return `${UI.renderPageHeader('Revenue Analytics & Income Breakdown','Deep-dive into platform financial volume, commissions, and payout flows.',periodSelect)}
        ${UI.renderKpiCards(kpi)}
        <div class="glass-card animate-slide-up mb-6"><div class="flex items-center justify-between mb-4"><div><h3 style="font-size:1.2rem;font-weight:700;">Revenue Trend</h3><p style="font-size:0.85rem;color:var(--text-muted);">Calculated directly from payment records.</p></div></div><div class="chart-container" style="height:380px;"><canvas id="revenueFullChart"></canvas></div></div>`;
    },
    changePeriod(v){this.state.months=parseInt(v,10)||6;App.refreshCurrentPage();},
    init(){
        const payments=DataService.getCollection(DataService.KEYS.PAYMENTS)||[]; const labels=[],gross=[],comm=[]; const now=new Date();
        for(let i=this.state.months-1;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);const next=new Date(d.getFullYear(),d.getMonth()+1,1);labels.push(d.toLocaleDateString('en-US',{month:'short',year:'2-digit'}));const m=payments.filter(p=>p.status==='Completed'&&p.date&&new Date(p.date)>=d&&new Date(p.date)<next);gross.push(m.reduce((s,p)=>s+(+p.amount||0),0));comm.push(m.reduce((s,p)=>s+(+p.commissionFee||0),0));}
        ChartsEngine.renderRevenueTrendChart('revenueFullChart',labels,gross,comm);
    }
};
