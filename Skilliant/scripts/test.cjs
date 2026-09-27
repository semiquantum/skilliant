const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = process.cwd();

const required = [
  'index.html','package.json','.env.example','SUPABASE_SETUP.sql','EMAILJS_SETUP.md',
  'js/auth.js','js/services/dataService.js','js/supabase-config.js','js/components.js',
  'supabase/functions/_shared.ts','supabase/functions/request-password-otp/index.ts',
  'supabase/functions/verify-password-otp/index.ts','supabase/functions/reset-password/index.ts',
  'supabase/functions/request-email-otp/index.ts','supabase/functions/verify-email-otp/index.ts',
  'supabase/functions/create-admin/index.ts','supabase/functions/list-admins/index.ts',
  'supabase/functions/update-admin/index.ts','supabase/functions/delete-admin/index.ts'
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
}

const jsFiles = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (p.endsWith('.js') && !p.includes(`${path.sep}node_modules${path.sep}`)) jsFiles.push(p);
  }
}
walk(path.join(root, 'js'));
for (const file of jsFiles) {
  const r = spawnSync(process.execPath, ['--check', file], { encoding:'utf8' });
  if (r.status !== 0) throw new Error(`JavaScript syntax error in ${file}: ${r.stderr}`);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const localRefs = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)]
  .map(m => m[1]).filter(ref => !/^(https?:|#|mailto:|javascript:|data:)/i.test(ref));
for (const ref of localRefs) {
  const clean = ref.split('?')[0].split('#')[0];
  if (!clean) continue;
  if (!fs.existsSync(path.join(root, clean))) throw new Error(`Broken local HTML reference: ${ref}`);
}

const cfg = fs.readFileSync(path.join(root, 'js/supabase-config.js'), 'utf8');
for (const token of ['request-password-otp','verify-password-otp','reset-password','create-admin','list-admins','update-admin','delete-admin']) {
  if (!cfg.includes(token)) throw new Error(`Generated config missing ${token}`);
}
const env = fs.readFileSync(path.join(root, '.env'), 'utf8');
if (/(?:sb_secret_|service_role|GOCSPX-|CLIENT_SECRET|PRIVATE_KEY)/i.test(env)) throw new Error('Private/server secret appears in frontend .env');
if (fs.existsSync(path.join(root, 'node_modules'))) throw new Error('node_modules must not be packaged');

const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8').split(/\r?\n/);
if (!gitignore.includes('.env')) throw new Error('.env must be ignored by Git');

const components = fs.readFileSync(path.join(root, 'js/components.js'), 'utf8');
if (components.includes('Export CSV (configure exportConfig)')) throw new Error('A dummy CSV export button remains');
if (!components.includes('ExportUtil.exportTableCSV(this)')) throw new Error('Generic CSV export handler is missing');

const app = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const pageFiles = fs.readdirSync(path.join(root, 'js/pages')).filter(x => x.endsWith('.js'));
for (const route of ['dashboard','users','labour','contractors','categories','skills','bookings','payments','reports','notifications','support','activity','settings','admins','roles']) {
  if (!new RegExp(`['"]${route}['"]\\s*:`).test(app)) throw new Error(`App route missing: ${route}`);
}
const navRoutes = [...html.matchAll(/data-page=["']([^"']+)["']/g)].map(m => m[1]);
for (const route of navRoutes) {
  if (!new RegExp(`['"]${route}['"]\\s*:`).test(app)) throw new Error(`Navigation points to an unregistered route: ${route}`);
}

const sql = fs.readFileSync(path.join(root, 'SUPABASE_SETUP.sql'), 'utf8');
if (/-- SUPABASE_SERVICE_ROLE_KEY\b/.test(sql)) throw new Error('SQL docs still instruct an invalid custom SUPABASE_* secret');
if (!sql.includes('alter table public.admin_users enable row level security')) throw new Error('Admin RLS is missing');
if (!sql.includes('create policy "active_admin_update_portal_records"')) throw new Error('Portal-record update RLS is missing');

const shared = fs.readFileSync(path.join(root, 'supabase/functions/_shared.ts'), 'utf8');
if (!shared.includes('SUPABASE_SECRET_KEYS')) throw new Error('Edge Functions do not use current Supabase secret-key injection');

const fn = name => fs.readFileSync(path.join(root, `supabase/functions/${name}/index.ts`), 'utf8');
if (!fn('create-admin').includes('deleteUser(created.user.id)')) throw new Error('Create-admin rollback is missing');
if (!fn('update-admin').includes('At least one active Super Admin must remain.')) throw new Error('Super Admin protection is missing from update-admin');
if (!fn('update-admin').includes('emailChanged && normalizedEmail !== target.email')) throw new Error('Unchanged admin email must not be re-unverified');
if (!fn('request-password-otp').includes('Do not disclose whether an email exists.')) throw new Error('Password-reset enumeration protection is missing');

const absoluteWindowsPath = /[A-Za-z]:\\\\Users\\/;
for (const file of jsFiles) {
  const source = fs.readFileSync(file, 'utf8');
  if (absoluteWindowsPath.test(source)) throw new Error(`Absolute Windows user path found in ${path.relative(root,file)}`);
}

console.log(`PASS: ${jsFiles.length} JavaScript files syntax-checked.`);
console.log(`PASS: ${localRefs.length} local HTML references resolved.`);
console.log('PASS: required auth/OTP/EmailJS files present.');
console.log('PASS: frontend env contains public configuration only.');
console.log('PASS: .env is Git-ignored.');
console.log('PASS: node_modules excluded.');
console.log('PASS: CSV/Print controls are functional (no dummy CSV button).');
console.log('PASS: navigation routes are registered.');
console.log('PASS: Supabase RLS/security checks present.');
console.log('PASS: administrator lifecycle safeguards present.');
// Dynamic page HTML uses inline handlers; ensure every controller/service referenced
// by those handlers is explicitly exposed on window.
const appSource = fs.readFileSync(path.join(root, 'js/app.js'), 'utf8');
const requiredGlobals = [
  'App','Auth','DataService','PaymentService','ModalManager','Sidebar','Toast','UI','Pagination','ExportUtil',
  'DashboardPage','UsersPage','LabourPage','ContractorsPage','CategoriesPage','SkillsPage','BookingsPage','PaymentsPage',
  'ReportsPage','NotificationsPage','SupportPage','ActivityLogsPage','SettingsPage','AdminsPage','RolesPage'
];
for (const name of requiredGlobals) {
  if (!new RegExp('window\\.' + name + '\\s*=\\s*' + name + '\\b').test(appSource)) {
    throw new Error(`Missing global button-handler bridge: window.${name}`);
  }
}
console.log('PASS: dynamic button-handler global bridges present.');
// Validate every inline controller.method handler used by the shipped UI against
// a real method definition. This catches dead buttons before packaging.
const shippedSources = jsFiles.map(file => fs.readFileSync(file, 'utf8')).join('\n') + '\n' + html;
const inlineRefs = [...shippedSources.matchAll(/onclick="(?:\$\{)?([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)+)/g)]
  .map(m => m[1]).filter(ref => !ref.startsWith('window.') && !ref.startsWith('exportConfig.'));
const uniqueInlineRefs = [...new Set(inlineRefs)];
for (const ref of uniqueInlineRefs) {
  const dot = ref.indexOf('.');
  const controller = ref.slice(0, dot);
  const method = ref.slice(dot + 1);
  if (!new RegExp('window\\.' + controller + '\\s*=\\s*' + controller + '\\b').test(appSource)) {
    throw new Error(`Inline button controller is not exposed: ${ref}`);
  }
  if (!new RegExp('\\b' + method.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\([^)]*\\)\\s*\\{').test(shippedSources)) {
    throw new Error(`Inline button handler method is missing: ${ref}`);
  }
}
// The consolidated Reports export cards must not contain nested duplicate click handlers.
const reportsSource = fs.readFileSync(path.join(root, 'js/pages/reports.js'), 'utf8');
if (/glass-card-hover[\s\S]{0,180}onclick="\$\{onclick\}"[\s\S]{0,500}<button/.test(reportsSource)) {
  throw new Error('Reports export card still has a duplicate parent/button click handler');
}
console.log(`PASS: ${uniqueInlineRefs.length} inline button handlers validated.`);
console.log('PASS: no duplicate Reports export-card click handlers.');


