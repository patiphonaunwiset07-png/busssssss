import { SUPABASE_URL, SUPABASE_ANON_KEY, CONFIGURED } from './config.js';
let createClient;if(CONFIGURED)({createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'));
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sb=CONFIGURED?createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
let projects=[],profile={};

const demo={profile:{name_th:'ปฏิภณ อุ่นวิเศษ',name_en:'Patiphon Aunwiset',headline:'นักศึกษาครุศาสตร์คอมพิวเตอร์ และผู้สร้างสรรค์สื่อดิจิทัล',intro:'พื้นที่รวบรวมการเรียนรู้ ผลงาน และพัฒนาการตลอด 4 ปีในมหาวิทยาลัย',bio:'ผมตั้งใจพัฒนาทักษะด้านการสอน คอมพิวเตอร์ และสื่อดิจิทัล เพื่อสร้างประสบการณ์การเรียนรู้ที่เข้าถึงผู้เรียนทุกคน',email:'69121440202@srru.ac.th',phone:'—',facebook:'—',line_id:'—',photo_url:'',resume_url:'',start_year:2026},
projects:[{id:1,academic_year:1,semester:1,category:'coursework',title:'เริ่มต้นเส้นทางครูคอมพิวเตอร์',summary:'พื้นที่สำหรับบันทึกวิชา โครงงาน และสิ่งที่ได้เรียนรู้ในภาคการศึกษาแรก',details:'',problem:'อยากมีพื้นที่รวบรวมผลงานตลอด 4 ปีที่ค้นหาและอัปเดตได้ง่าย',role:'ผู้ออกแบบและพัฒนา',tools:['Figma','HTML/CSS'],skills:['ออกแบบ UI','การจัดระบบข้อมูล'],process:'สำรวจปัญหา → ออกแบบโครงสร้างเว็บไซต์ → พัฒนาและทดสอบ',learnings:'ได้ฝึกวางแผนโครงสร้างเว็บไซต์และการจัดการเนื้อหาอย่างเป็นระบบ',reflection:'เป็นจุดเริ่มต้นที่ดีของการเก็บผลงานอย่างต่อเนื่อง',github_url:'',video_url:'',gallery_urls:[],external_url:'',cover_url:'',featured:true}],
skills:[{name:'Canva',level:75,group_name:'Design'},{name:'CapCut',level:70,group_name:'Media'},{name:'Programming',level:45,group_name:'Technology'}],
practicums:[],documents:[],reflections:[],
settings:{site_title:'4-Year Digital Portfolio',logo_text:'PA',primary_color:'#1769d2',hero_badge:'Computer Education · University Portfolio',hero_cta_text:'ดูผลงานทั้งหมด',footer_text:'© {year} Patiphon Aunwiset · 4-Year Digital Portfolio',show_journey:true,show_projects:true,show_practicums:true,show_documents:true,show_reflections:true,show_skills:true,show_contact:true,maintenance_mode:false,maintenance_message:'เว็บไซต์อยู่ระหว่างปรับปรุง กรุณากลับมาอีกครั้งภายหลัง'}};

$('#year').textContent=new Date().getFullYear()+543;
$('#menu').onclick=()=>$('#navlinks').classList.toggle('open');
document.querySelectorAll('.navlinks a').forEach(a=>a.onclick=()=>$('#navlinks').classList.remove('open'));

// language toggle (lightweight bilingual UI chrome)
const i18nEN={nav_journey:'Journey',nav_projects:'Projects',nav_professional:'Experience',nav_documents:'Documents',nav_skills:'Skills',nav_contact:'Contact',nav_admin:'Admin',hero_cta:'View all projects',hero_contact:'Contact',projects_title:'Projects & Experience',contact_send:'Send message'};
let lang=localStorage.getItem('portfolio_lang')||'th';
function applyLang(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    if(!el.dataset.th)el.dataset.th=el.textContent;
    el.textContent=lang==='en'?(i18nEN[el.dataset.i18n]||el.dataset.th):el.dataset.th;
  });
  $('#langToggle').textContent=lang==='en'?'TH':'EN';
}
$('#langToggle').onclick=()=>{lang=lang==='en'?'th':'en';localStorage.setItem('portfolio_lang',lang);applyLang()};
applyLang();

// dark mode toggle
let theme=localStorage.getItem('portfolio_theme')||'light';
function applyTheme(){document.documentElement.setAttribute('data-theme',theme);$('#themeToggle').textContent=theme==='dark'?'☀':'🌙'}
$('#themeToggle').onclick=()=>{theme=theme==='dark'?'light':'dark';localStorage.setItem('portfolio_theme',theme);applyTheme()};
applyTheme();

function showSkeleton(show){$('#skeletonWrap').classList.toggle('hidden',!show);$('#mainContent').classList.toggle('hidden',show)}

async function trackEvent(type,project_id=null){
  if(!sb)return;
  try{await sb.from('analytics_events').insert({type,project_id})}catch(e){/* table may not exist yet, ignore */}
}

async function load(){
  let d=demo;
  if(sb){
    const rs=await Promise.all([
      sb.from('profiles').select('*').eq('id',1).single(),
      sb.from('projects').select('*').eq('published',true).order('sort_order'),
      sb.from('skills').select('*').eq('published',true).order('sort_order'),
      sb.from('practicums').select('*').eq('published',true).order('sort_order'),
      sb.from('documents').select('*').eq('published',true).order('sort_order'),
      sb.from('reflections').select('*').eq('published',true).order('academic_year').order('semester'),
      sb.from('site_settings').select('*').eq('id',1).single()
    ]);
    if(!rs.some(x=>x.error))d={profile:rs[0].data,projects:rs[1].data||[],skills:rs[2].data||[],practicums:rs[3].data||[],documents:rs[4].data||[],reflections:rs[5].data||[],settings:rs[6].data};
  }
  render(d);
  trackEvent('page_view');
}

function empty(text){return`<div class="empty">${text}</div>`}
function toArr(v){return Array.isArray(v)?v:(v?String(v).split(',').map(x=>x.trim()).filter(Boolean):[])}
function tagRow(items){return items.length?`<div class="tagRow">${items.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div>`:''}

function render(d){
  const p=d.profile,s=d.settings||demo.settings;
  profile=p;
  showSkeleton(false);
  document.documentElement.style.setProperty('--blue',s.primary_color||'#1769d2');
  document.title=`${s.site_title||'4-Year Portfolio'} — ${p.name_en}`;
  document.querySelectorAll('.logo').forEach(x=>x.textContent=(s.logo_text||'PA').slice(0,3));
  $('#heroBadge').textContent=s.hero_badge||'Computer Education · University Portfolio';
  $('#heroCta').textContent=s.hero_cta_text||'ดูผลงานทั้งหมด';
  $('#footerText').textContent=(s.footer_text||'© {year} Patiphon Aunwiset · 4-Year Digital Portfolio').replaceAll('{year}',String(new Date().getFullYear()+543));
  const desc=s.seo_description||p.intro||'';
  document.querySelector('#metaDescription').content=desc;
  const pageUrl=location.origin+location.pathname;
  $('#ogTitle').content=document.title;$('#ogDescription').content=desc;
  $('#twTitle').content=document.title;$('#twDescription').content=desc;
  $('#ogUrl').content=pageUrl;
  const ogImg=s.og_image_url||p.photo_url||'';
  if(ogImg){$('#ogImage').content=encodeURI(new URL(ogImg,pageUrl).href);$('#twImage').content=encodeURI(new URL(ogImg,pageUrl).href)}
  if(p.resume_url){$('#heroResume').href=esc(p.resume_url);$('#heroResume').classList.remove('hidden')}else{$('#heroResume').classList.add('hidden')}
  if(s.maintenance_mode){document.body.classList.add('maintenanceMode');document.querySelector('main').innerHTML=`<section><div class="wrap empty"><h2>เว็บไซต์อยู่ระหว่างปรับปรุง</h2><p>${esc(s.maintenance_message||'กรุณากลับมาอีกครั้งภายหลัง')}</p></div></section>`;return}
  $('#journey').classList.toggle('hidden',s.show_journey===false);
  $('#projects').classList.toggle('hidden',s.show_projects===false);
  $('#professional').classList.toggle('hidden',!s.show_practicums);
  $('#growth').classList.toggle('hidden',!s.show_reflections);
  $('#documents').classList.toggle('hidden',!s.show_documents);
  $('#skills').classList.toggle('hidden',s.show_skills===false);
  $('#contact').classList.toggle('hidden',s.show_contact===false);
  $('#name').firstChild.nodeValue=p.name_th;
  $('#nameEn').textContent=p.name_en;
  $('#headline').textContent=p.headline;
  $('#intro').textContent=p.intro;
  $('#bio').textContent=p.bio;
  projects=d.projects;
  $('#projectCount').textContent=projects.length;
  $('#yearNow').textContent=Math.max(1,Math.min(4,new Date().getFullYear()-(p.start_year||new Date().getFullYear())+1));
  if(p.photo_url){$('#portrait').style.backgroundImage=`url('${encodeURI(p.photo_url)}')`;$('#portrait span').style.display='none'}
  const labels=['พื้นฐานและการปรับตัว','ต่อยอดทักษะและโครงงาน','ประสบการณ์วิชาชีพ','สรุปการเติบโตและฝึกสอน'];
  $('#years').innerHTML=labels.map((x,i)=>`<article class="yearCard"><b>0${i+1}</b><span>ชั้นปีที่ ${i+1}</span><p>${x}</p><small>${projects.filter(v=>v.academic_year===i+1).length} ผลงาน</small></article>`).join('');
  buildSkillFilterOptions();
  renderFeatured();
  applyFilters();
  $('#skillGrid').innerHTML=d.skills.map(x=>`<article class="card"><div class="skillTop"><b>${esc(x.name)}</b><span>${esc(x.group_name)} · ${x.level}%</span></div><div class="bar"><i style="width:${+x.level}%"></i></div></article>`).join('')||empty('ยังไม่มีข้อมูลทักษะ');
  $('#practicumGrid').innerHTML=d.practicums.map(x=>`<article class="card project"><div class="cover" ${x.cover_url?`style="background-image:url('${encodeURI(x.cover_url)}')"`:''}>${x.cover_url?'':'EDU'}</div><div class="projectBody"><span class="badge">ปี ${x.academic_year} · ${esc(x.type)}</span><h3>${esc(x.title)}</h3><p><b>${esc(x.organization)}</b></p><p>${esc(x.description)}</p>${x.evidence_url?`<a href="${esc(x.evidence_url)}" target="_blank" rel="noopener">ดูหลักฐาน →</a>`:''}</div></article>`).join('')||empty('ยังไม่มีข้อมูลฝึกสอนหรือฝึกงาน');
  $('#reflectionGrid').innerHTML=d.reflections.map(x=>`<article class="card"><span class="badge">ปี ${x.academic_year} · ภาคเรียน ${x.semester}</span><h3>${esc(x.title)}</h3><p><b>สิ่งที่เรียนรู้</b><br>${esc(x.learned)}</p><p class="meta"><b>เป้าหมายถัดไป</b><br>${esc(x.next_goal)}</p></article>`).join('')||empty('ยังไม่มีบันทึกการเติบโต');
  $('#documentGrid').innerHTML=d.documents.map(x=>`<article class="card project"><div class="cover" ${x.cover_url?`style="background-image:url('${encodeURI(x.cover_url)}')"`:''}>${x.cover_url?'':'PDF'}</div><div class="projectBody"><span class="badge">${esc(x.type)}</span><h3>${esc(x.title)}</h3><p>${esc(x.issuer||x.description)}</p><a href="${esc(x.file_url)}" target="_blank" rel="noopener">เปิดเอกสาร →</a></div></article>`).join('')||empty('ยังไม่มีเอกสารที่เปิดเผยต่อสาธารณะ');
  $('#contactInfo').innerHTML=[['อีเมล',p.email],['โทรศัพท์',p.phone],['Facebook',p.facebook],['LINE',p.line_id]].map(x=>`<div class="contactLine"><b>${x[0]}</b><div>${esc(x[1]||'—')}</div></div>`).join('');
  maybeOpenFromHash();
}

function projectCard(x){
  return `<article class="card project" data-open="${x.id}"><div class="cover" ${x.cover_url?`style="background-image:url('${encodeURI(x.cover_url)}')"`:''}>${x.cover_url?'':'0'+x.academic_year}</div><div class="projectBody"><span class="badge">ปี ${x.academic_year} · ${esc(x.category)}</span><h3>${esc(x.title)}</h3><p>${esc(x.summary)}</p>${tagRow(toArr(x.skills).slice(0,3))}<a data-open="${x.id}">ดูรายละเอียด →</a></div></article>`;
}
function buildSkillFilterOptions(){
  const set=new Set();
  projects.forEach(x=>toArr(x.skills).forEach(s=>set.add(s)));
  const sel=$('#skillFilter'),current=sel.value;
  sel.innerHTML='<option value="all">ทุกทักษะที่ใช้</option>'+[...set].sort().map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
  if([...set].includes(current))sel.value=current;
}

function applyFilters(){
  const year=($('.filters button.active')||{}).dataset?.year||'all';
  const q=$('#searchInput').value.trim().toLowerCase();
  const cat=$('#categoryFilter').value;
  const sem=$('#semesterFilter').value;
  const skill=$('#skillFilter').value;
  const featuredOnly=$('#featuredFilter').checked;
  let a=projects.filter(x=>{
    if(year!=='all'&&String(x.academic_year)!==String(year))return false;
    if(cat!=='all'&&x.category!==cat)return false;
    if(sem!=='all'&&String(x.semester)!==String(sem))return false;
    if(skill!=='all'&&!toArr(x.skills).includes(skill))return false;
    if(featuredOnly&&!x.featured)return false;
    if(q){
      const hay=[x.title,x.title_en,x.summary,x.details,...toArr(x.tools),...toArr(x.skills)].join(' ').toLowerCase();
      if(!hay.includes(q))return false;
    }
    return true;
  });
  $('#projectGrid').innerHTML=a.map(projectCard).join('')||empty('ยังไม่มีผลงานตรงกับเงื่อนไขที่เลือก');
  $('#resultCount').textContent=`พบ ${a.length} ผลงาน`;
}
function renderFeatured(){
  const featured=projects.filter(x=>x.featured);
  if(featured.length){$('#featuredWrap').classList.remove('hidden');$('#featuredGrid').innerHTML=featured.map(projectCard).join('')}
  else{$('#featuredWrap').classList.add('hidden')}
}

$('#yearFilters').onclick=e=>{if(!e.target.dataset.year)return;document.querySelectorAll('.filters button').forEach(x=>x.classList.toggle('active',x===e.target));applyFilters()};
['searchInput'].forEach(id=>$('#'+id).addEventListener('input',applyFilters));
['categoryFilter','semesterFilter','skillFilter','featuredFilter'].forEach(id=>$('#'+id).addEventListener('change',applyFilters));

document.addEventListener('click',e=>{
  const id=e.target.closest('[data-open]')?.dataset.open;
  if(id)openDetail(id);
});

function openDetail(id){
  const x=projects.find(v=>String(v.id)===String(id));
  if(!x)return;
  $('#detailTitle').textContent=x.title;
  const gallery=toArr(x.gallery_urls);
  $('#detailBody').innerHTML=`
    ${x.cover_url?`<img class="detailCover" src="${encodeURI(x.cover_url)}" alt="${esc(x.title)}">`:''}
    <div class="detailMeta"><span class="badge">ปี ${x.academic_year}${x.semester?` · ภาคเรียน ${x.semester}`:''}</span><span class="badge">${esc(x.category||'')}</span>${x.featured?'<span class="badge">ผลงานเด่น</span>':''}</div>
    ${x.problem?`<div class="detailSection"><h4>ที่มาและปัญหาของโครงงาน</h4><p>${esc(x.problem)}</p></div>`:''}
    ${x.role?`<div class="detailSection"><h4>บทบาทของฉัน</h4><p>${esc(x.role)}</p></div>`:''}
    ${toArr(x.tools).length?`<div class="detailSection"><h4>เครื่องมือและเทคโนโลยี</h4>${tagRow(toArr(x.tools))}</div>`:''}
    ${x.process?`<div class="detailSection"><h4>ขั้นตอนการทำงาน</h4><p>${esc(x.process)}</p></div>`:''}
    ${x.details?`<div class="detailSection"><h4>รายละเอียดเพิ่มเติม</h4><p>${esc(x.details)}</p></div>`:''}
    ${x.learnings?`<div class="detailSection"><h4>สิ่งที่ได้เรียนรู้</h4><p>${esc(x.learnings)}</p></div>`:''}
    ${toArr(x.skills).length?`<div class="detailSection"><h4>ทักษะที่ใช้</h4>${tagRow(toArr(x.skills))}</div>`:''}
    ${x.video_url?`<div class="detailSection"><h4>วิดีโอผลงาน</h4><video class="detailVideo" src="${encodeURI(x.video_url)}" controls></video></div>`:''}
    ${gallery.length?`<div class="detailSection"><h4>รูปภาพผลงาน</h4><div class="galleryGrid">${gallery.map(g=>`<img src="${encodeURI(g)}" alt="">`).join('')}</div></div>`:''}
    ${x.reflection?`<div class="detailSection"><h4>Reflection หลังจบผลงาน</h4><p>${esc(x.reflection)}</p></div>`:''}
    <div class="detailLinks">
      ${x.github_url?`<a class="button" href="${esc(x.github_url)}" target="_blank" rel="noopener">GitHub Repository →</a>`:''}
      ${x.external_url?`<a class="button" href="${esc(x.external_url)}" target="_blank" rel="noopener">เว็บไซต์ / ลิงก์ผลงาน →</a>`:''}
    </div>`;
  $('#detailOverlay').classList.add('open');
  history.replaceState(null,'','#project-'+x.id);
  trackEvent('project_view',x.id);
}
function closeDetail(){$('#detailOverlay').classList.remove('open');history.replaceState(null,'','#projects')}
$('#detailClose').onclick=closeDetail;
$('#detailOverlay').addEventListener('click',e=>{if(e.target.id==='detailOverlay')closeDetail()});
function maybeOpenFromHash(){
  const m=location.hash.match(/^#project-(.+)$/);
  if(m)openDetail(m[1]);
}
window.addEventListener('hashchange',()=>{if(!location.hash.startsWith('#project-'))closeDetail()});

function openShare(){
  const url=location.origin+location.pathname;
  $('#shareLink').value=url;
  $('#shareFb').href='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url);
  $('#shareLine').href='https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(url);
  const qrUrl='https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data='+encodeURIComponent(url);
  $('#qrImg').src=qrUrl;
  $('#qrDownload').href=qrUrl;
  $('#shareModal').classList.add('open');
}
$('#shareBtn').onclick=openShare;
$('#shareClose').onclick=()=>$('#shareModal').classList.remove('open');
$('#shareModal').addEventListener('click',e=>{if(e.target.id==='shareModal')$('#shareModal').classList.remove('open')});
$('#copyLinkBtn').onclick=async()=>{
  try{await navigator.clipboard.writeText($('#shareLink').value);$('#copyLinkBtn').textContent='คัดลอกแล้ว ✓';setTimeout(()=>$('#copyLinkBtn').textContent='คัดลอก',2000)}
  catch{$('#shareLink').select();document.execCommand('copy')}
};

const formLoadedAt=Date.now();
$('#contactForm').onsubmit=async e=>{
  e.preventDefault();
  const out=$('#formStatus');
  const fd=new FormData(e.target);
  if(fd.get('website')){
    // honeypot triggered — pretend success, do not actually send
    out.className='ok';out.textContent='ส่งข้อความเรียบร้อย ขอบคุณครับ';
    e.target.reset();return;
  }
  if(Date.now()-formLoadedAt<2500){out.className='error';out.textContent='กรุณาลองส่งใหม่อีกครั้ง';return}
  if(!sb){out.className='error';out.textContent='กรุณาตั้งค่า Supabase ก่อนใช้งาน';return}
  out.textContent='กำลังส่ง…';
  const payload=Object.fromEntries(fd);delete payload.website;
  const{error}=await sb.from('messages').insert(payload);
  out.className=error?'error':'ok';
  out.textContent=error?error.message:'ส่งข้อความเรียบร้อย ขอบคุณครับ';
  if(!error)e.target.reset();
};

load();
