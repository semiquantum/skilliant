/**
 * Day 4 Deliverable: Export Report UI & Custom Generator
 */

const ExportReportsPage = {
    render() {
        return `
            ${UI.renderPageHeader('Export Custom Data Reports', 'Generate downloadable CSV / PDF statements for accounting, audits, and compliance.')}

            <div class="glass-card animate-slide-up" style="max-width:800px;">
                <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:1.25rem;">Report Builder Configuration</h3>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.25rem;" class="mb-4">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:4px;">Report Dataset Type</label>
                        <select id="exportDataset" class="form-control" style="width:100%;">
                            <option value="Bookings & Escrow">Bookings & Escrow Transactions</option>
                            <option value="Revenue & Commissions">Platform Revenue & 10% Fees</option>
                            <option value="Labour Roster">Verified Labour Roster & Ratings</option>
                            <option value="Activity Audit Log">Admin Security Audit Logs</option>
                        </select>
                    </div>

                    <div>
                        <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:4px;">Export Format</label>
                        <select id="exportFormat" class="form-control" style="width:100%;">
                            <option value="CSV">Comma Separated Values (.CSV)</option>
                            <option value="PDF">Formatted PDF Document (.PDF)</option>
                            <option value="Excel">Microsoft Excel (.XLSX)</option>
                        </select>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1.25rem;" class="mb-6">
                    <div>
                        <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:4px;">Start Date</label>
                        <input type="date" id="exportStartDate" class="form-control" style="width:100%;" value="">
                    </div>
                    <div>
                        <label style="font-size:0.85rem; font-weight:600; display:block; margin-bottom:4px;">End Date</label>
                        <input type="date" id="exportEndDate" class="form-control" style="width:100%;" value="">
                    </div>
                </div>

                <div style="border-top:1px solid var(--border-color); padding-top:1.25rem;" class="flex justify-between items-center">
                    <span style="font-size:0.85rem; color:var(--text-muted);">Approximate file size: ~450 KB</span>
                    <button class="btn btn-accent" onclick="ExportReportsPage.generateExport()">
                        <span class="material-icons-round">download</span> Generate & Download Report
                    </button>
                </div>
            </div>
        `;
    },

    generateExport() {
        const dataset=document.getElementById('exportDataset')?.value;
        const format=document.getElementById('exportFormat')?.value;
        const start=document.getElementById('exportStartDate')?.value;
        const end=document.getElementById('exportEndDate')?.value;
        if(start && end && new Date(start)>new Date(end)){Toast.show('Start date cannot be after end date.','warning');return;}
        const map={
            'Bookings & Escrow':DataService.getCollection(DataService.KEYS.BOOKINGS)||[],
            'Revenue & Commissions':DataService.getCollection(DataService.KEYS.PAYMENTS)||[],
            'Labour Roster':DataService.getCollection(DataService.KEYS.LABOURS)||[],
            'Activity Audit Log':DataService.getCollection(DataService.KEYS.ACTIVITY_LOGS)||[]
        };
        let records=map[dataset]||[];
        const dateField=dataset==='Activity Audit Log'?'timestamp':dataset==='Labour Roster'?'joinedDate':'date';
        if(start)records=records.filter(x=>!x[dateField]||new Date(x[dateField])>=new Date(start));
        if(end){const d=new Date(end);d.setHours(23,59,59,999);records=records.filter(x=>!x[dateField]||new Date(x[dateField])<=d);}
        if(!records.length){Toast.show('No records match the selected filters.','warning');return;}
        const headers=Object.keys(records[0]); const rows=records.map(r=>headers.map(h=>r[h])); const filename=`skilliant_${dataset.toLowerCase().replace(/[^a-z0-9]+/g,'_')}`;
        if(format==='CSV'){ExportUtil.toCSV(headers,rows,filename);}
        else if(format==='PDF'){
            if(window.jspdf?.jsPDF){const doc=new window.jspdf.jsPDF({orientation:'landscape'});doc.setFontSize(14);doc.text(`Skilliant — ${dataset}`,14,15);doc.setFontSize(8);let y=24;const cols=headers.slice(0,8);doc.text(cols.join(' | '),14,y);y+=5;records.forEach(r=>{const line=cols.map(h=>String(r[h]??'').slice(0,22)).join(' | ');if(y>195){doc.addPage();y=15;}doc.text(line,14,y);y+=4;});doc.save(`${filename}.pdf`);Toast.show('PDF report downloaded.','success');}
            else ExportUtil.print(`Skilliant — ${dataset}`,`<table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${records.map(r=>`<tr>${headers.map(h=>`<td>${r[h]??''}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
        } else if(format==='Excel'){
            if(window.XLSX){const ws=XLSX.utils.json_to_sheet(records);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Report');XLSX.writeFile(wb,`${filename}.xlsx`);Toast.show('Excel report downloaded.','success');}
            else Toast.show('Excel export library is unavailable. Use CSV or PDF.','warning');
        }
        DataService.logActivity(`Exported ${format} report for ${dataset}${start?' from '+start:''}${end?' to '+end:''}`);
    }
};
