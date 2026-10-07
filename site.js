import { SUPABASE_URL, SUPABASE_ANON_KEY, CONFIGURED } from './config.js';
let createClient=null;
let sb=null;
async function initSupabase(){
 if(sb||!CONFIGURED)return sb;
 try{
  const mod=await Promise.race([
   import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'),
   new Promise((_,rej)=>setTimeout(()=>rej(new Error('Supabase client timeout')),6000))
  ]);
  createClient=mod.createClient;
  sb=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
 }catch(err){console.warn('[Portfolio OS] Supabase unavailable, using demo data.',err)}
 return sb;
}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=u=>{try{const x=new URL(u,location.href);return ['https:','http:','mailto:'].includes(x.protocol)?x.href:'#'}catch{return'#'}};
let projects=[],profile={},siteData={},currentMode=localStorage.getItem('portfolio_mode')||'recruiter',presentationIndex=0,commandIndex=0;
const sessionId=localStorage.getItem('portfolio_session')||(crypto?.randomUUID?crypto.randomUUID():String(Date.now()));localStorage.setItem('portfolio_session',sessionId);

const demo={
 profile:{name_th:'ปฏิภณ อุ่นวิเศษ',name_en:'Patiphon Aunwiset',headline:'นักศึกษาครุศาสตร์คอมพิวเตอร์ และผู้สร้างสรรค์สื่อดิจิทัล',intro:'พื้นที่รวบรวมการเรียนรู้ ผลงาน และพัฒนาการตลอด 4 ปีในมหาวิทยาลัย',bio:'ผมตั้งใจพัฒนาทักษะด้านการสอน คอมพิวเตอร์ และสื่อดิจิทัล เพื่อสร้างประสบการณ์การเรียนรู้ที่เข้าถึงผู้เรียนทุกคน',email:'69121440202@srru.ac.th',phone:'—',facebook:'—',line_id:'—',photo_url:'',resume_url:'',start_year:2026,expected_graduation_year:2029},
 projects:[
  {id:1,academic_year:1,semester:1,category:'coursework',title:'เริ่มต้นเส้นทางครูคอมพิวเตอร์',title_en:'Beginning Computer Education Journey',summary:'พื้นที่สำหรับบันทึกวิชา โครงงาน และสิ่งที่ได้เรียนรู้ในภาคการศึกษาแรก',details:'ออกแบบโครงสร้าง Portfolio ให้พร้อมเติบโตต่อเนื่องตลอด 4 ปี',problem:'อยากมีพื้นที่รวบรวมผลงานตลอด 4 ปีที่ค้นหาและอัปเดตได้ง่าย',role:'ผู้ออกแบบและพัฒนา',tools:['Figma','HTML/CSS'],skills:['ออกแบบ UI','การจัดระบบข้อมูล'],process:'สำรวจปัญหา → ออกแบบโครงสร้างเว็บไซต์ → พัฒนาและทดสอบ',learnings:'ได้ฝึกวางแผนโครงสร้างเว็บไซต์และการจัดการเนื้อหาอย่างเป็นระบบ',reflection:'เป็นจุดเริ่มต้นที่ดีของการเก็บผลงานอย่างต่อเนื่อง',github_url:'',video_url:'',gallery_urls:[],external_url:'',cover_url:'',featured:true,published:true,sort_order:1},
  {id:2,academic_year:1,semester:2,category:'media',title:'สื่อการเรียนรู้ด้วย Canva',title_en:'Interactive Learning Media',summary:'ออกแบบอินโฟกราฟิกและสื่อประกอบการเรียนรู้สำหรับนักเรียน',details:'เน้นความชัดเจน อ่านง่าย และเหมาะกับการเรียนรู้บนมือถือ',problem:'ผู้เรียนต้องการสื่อที่สั้น กระชับ และเห็นภาพ',role:'ออกแบบสื่อและจัดวางเนื้อหา',tools:['Canva','PowerPoint'],skills:['Graphic Design','Educational Media'],process:'กำหนดกลุ่มเป้าหมาย → วางโครงเรื่อง → ออกแบบ → ทดลองใช้',learnings:'ได้ฝึกแปลงเนื้อหาวิชาให้กลายเป็นสื่อที่เข้าใจง่าย',reflection:'ในอนาคตจะเพิ่มระบบ interactive และกิจกรรมระหว่างเรียน',github_url:'',video_url:'',gallery_urls:[],external_url:'',cover_url:'',featured:true,published:true,sort_order:2}
 ],
 skills:[{name:'Canva',level:82,start_level:45,target_level:95,group_name:'Design'},{name:'CapCut',level:78,start_level:40,target_level:90,group_name:'Media'},{name:'Programming',level:64,start_level:20,target_level:85,group_name:'Technology'},{name:'Teaching',level:72,start_level:30,target_level:95,group_name:'Education'}],
 practicums:[],documents:[],reflections:[],
 settings:{site_title:'Portfolio OS · Patiphon Aunwiset',logo_text:'PA',primary_color:'#1769d2',hero_badge:'Computer Education · University Portfolio',hero_cta_text:'ดูผลงานทั้งหมด',seo_description:'แฟ้มสะสมผลงานดิจิทัล 4 ปี ปฏิภณ อุ่นวิเศษ นักศึกษาครุศาสตร์คอมพิวเตอร์',og_image_url:'',footer_text:'© {year} Patiphon Aunwiset · Portfolio OS',show_journey:true,show_projects:true,show_practicums:true,show_documents:true,show_reflections:true,show_skills:true,show_contact:true,maintenance_mode:false,maintenance_message:'เว็บไซต์อยู่ระหว่างปรับปรุง กรุณากลับมาอีกครั้งภายหลัง'}
};

const i18nEN={nav_journey:'Journey',nav_projects:'Projects',nav_professional:'Experience',nav_documents:'Documents',nav_skills:'Skills',nav_contact:'Contact',nav_admin:'Admin',hero_cta:'View all projects',hero_contact:'Contact',projects_title:'Projects & Experience',contact_send:'Send message'};
let lang=localStorage.getItem('portfolio_lang')||'th';
function applyLang(){ $$('#siteHeader [data-i18n],#mainContent [data-i18n]').forEach(el=>{if(!el.dataset.th)el.dataset.th=el.textContent;el.textContent=lang==='en'?(i18nEN[el.dataset.i18n]||el.dataset.th):el.dataset.th});$('#langToggle').textContent=lang==='en'?'TH':'EN'; }
$('#langToggle').onclick=()=>{lang=lang==='en'?'th':'en';localStorage.setItem('portfolio_lang',lang);applyLang()};applyLang();
let theme=localStorage.getItem('portfolio_theme')||'light';
function applyTheme(){document.documentElement.setAttribute('data-theme',theme);$('#themeToggle').textContent=theme==='dark'?'☀':'🌙'}
$('#themeToggle').onclick=()=>{theme=theme==='dark'?'light':'dark';localStorage.setItem('portfolio_theme',theme);applyTheme()};applyTheme();

const showSkeleton=show=>{$('#skeletonWrap').classList.toggle('hidden',!show);$('#mainContent').classList.toggle('hidden',show)};
const toArr=v=>Array.isArray(v)?v:(v?String(v).split(',').map(x=>x.trim()).filter(Boolean):[]);
const tagRow=items=>items?.length?`<div class="tagRow">${items.map(x=>`<span class="tag">${esc(x)}</span>`).join('')}</div>`:'';
const empty=text=>`<div class="empty">${esc(text)}</div>`;
const scrollTo=id=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
$$('.statLink,.quickCard').forEach(b=>b.addEventListener('click',()=>scrollTo(b.dataset.scroll)));
$('#menu').onclick=()=>$('#navlinks').classList.toggle('open');
$$('.navlinks a').forEach(a=>a.onclick=()=>$('#navlinks').classList.remove('open'));
$('#backTop').onclick=()=>scrollTo('home');

async function trackEvent(type,project_id=null){
 if(!sb)return;
 try{await sb.from('analytics_events').insert({type,project_id,session_id:sessionId,path:location.pathname,referrer:document.referrer||null,device:/Mobi|Android/i.test(navigator.userAgent)?'mobile':'desktop'})}catch{}
}

async function load(){
 // Render immediately from local demo data so the site never stays on the skeleton
 // while Supabase/network/schema problems are being resolved.
 siteData=demo;
 try{render(demo)}catch(err){console.warn('[Portfolio OS] render error (demo), showing page anyway.',err)}
 showSkeleton(false);
 
 if(!CONFIGURED)return;
 const client=await initSupabase();
 if(!client)return;
 
 try{
  const queries=[
   client.from('public_profile').select('*').eq('id',1).single(),
   client.from('projects').select('*').eq('published',true).order('academic_year').order('sort_order'),
   client.from('skills').select('*').eq('published',true).order('sort_order'),
   client.from('practicums').select('*').eq('published',true).order('academic_year').order('sort_order'),
   client.from('documents').select('*').eq('published',true).order('sort_order'),
   client.from('reflections').select('*').eq('published',true).order('academic_year').order('semester'),
   client.from('site_settings').select('*').eq('id',1).single()
  ];
  const rs=await Promise.race([
   Promise.all(queries),
   new Promise((_,rej)=>setTimeout(()=>rej(new Error('Supabase data timeout')),7000))
  ]);
  if(rs[0]?.data && rs[6]?.data){
   const d={
    profile:rs[0].data,
    projects:rs[1]?.error?demo.projects:(rs[1]?.data||[]),
    skills:rs[2]?.error?demo.skills:(rs[2]?.data||[]),
    practicums:rs[3]?.error?demo.practicums:(rs[3]?.data||[]),
    documents:rs[4]?.error?demo.documents:(rs[4]?.data||[]),
    reflections:rs[5]?.error?demo.reflections:(rs[5]?.data||[]),
    settings:rs[6].data
   };
   siteData=d;
   try{render(d)}catch(err){console.warn('[Portfolio OS] render error (live data). Keeping demo render.',err)}
  }else{
   console.warn('[Portfolio OS] Public profile/site settings are not ready. Keeping demo data.',rs.map(x=>x?.error).filter(Boolean));
  }
 }catch(err){
  console.warn('[Portfolio OS] Supabase load failed. Keeping demo data.',err);
 }
 trackEvent('page_view');
}

function healthScore(d){
 const p=d.profile||{},s=d.settings||{},counts=[d.projects.length,d.skills.length,d.documents.length,d.practicums.length,d.reflections.length];
 let score=45;score+=p.photo_url?8:0;score+=p.resume_url?8:0;score+=p.bio?6:0;score+=p.email?4:0;score+=Math.min(15,d.projects.length*3);score+=Math.min(8,d.skills.length*2);score+=d.documents.length?4:0;score+=s.seo_description?4:0;score+=counts.filter(x=>x>0).length;return Math.min(100,score);
}
function setMeta(d){
 const p=d.profile,s=d.settings||{};document.documentElement.style.setProperty('--blue',s.primary_color||'#1769d2');document.title=`${s.site_title||'4-Year Portfolio'} — ${p.name_en}`;$$('.logo').forEach(x=>x.textContent=(s.logo_text||'PA').slice(0,3));$('#heroBadge').textContent=s.hero_badge||'Computer Education · University Portfolio';$('#heroCta').textContent=s.hero_cta_text||'ดูผลงานทั้งหมด';$('#footerText').innerHTML=esc(s.footer_text||'© {year} Patiphon Aunwiset · Portfolio OS').replaceAll('{year}',String(new Date().getFullYear()+543));
 const desc=s.seo_description||p.intro||'';$('#metaDescription').content=desc;const pageUrl=location.href.split('#')[0];$('#ogTitle').content=document.title;$('#ogDescription').content=desc;$('#twTitle').content=document.title;$('#twDescription').content=desc;$('#ogUrl').content=pageUrl;const img=s.og_image_url||p.photo_url||'';if(img){const u=safeUrl(img);$('#ogImage').content=u;$('#twImage').content=u}
}

function render(d){
 const p=d.profile,s=d.settings||demo.settings;profile=p;projects=d.projects||[];setMeta(d);const yearEl=$('#year');if(yearEl)yearEl.textContent=new Date().getFullYear()+543;
 const score=healthScore(d);$('#healthScoreHero').textContent=score;$('#projectCount').textContent=projects.length;$('#topProjectCount').textContent=projects.length;$('#skillCount').textContent=(d.skills||[]).length;$('#topSkillLabel').textContent=(d.skills?.slice().sort((a,b)=>(b.level||0)-(a.level||0))[0]?.name)||'Skill Map';$('#yearNow').textContent=Math.max(1,Math.min(4,new Date().getFullYear()-(p.start_year||new Date().getFullYear())+1));
 $('#name').firstChild.nodeValue=p.name_th||'';$('#nameEn').textContent=p.name_en||'';$('#headline').textContent=p.headline||'';$('#intro').textContent=p.intro||'';$('#bio').textContent=p.bio||'';
 if(p.photo_url){$('#portrait').style.backgroundImage=`url("${encodeURI(p.photo_url)}")`;$('#portrait span').style.display='none'}
 const labels=['พื้นฐานและการปรับตัว','ต่อยอดทักษะและโครงงาน','ประสบการณ์วิชาชีพ','สรุปการเติบโตและฝึกสอน'];
 $('#years').innerHTML=labels.map((x,i)=>`<button class="yearCard" data-year-jump="${i+1}"><b>0${i+1}</b><span>ชั้นปีที่ ${i+1}</span><p>${x}</p><small>${projects.filter(v=>+v.academic_year===i+1).length} ผลงาน · ${d.reflections.filter(v=>+v.academic_year===i+1).length} reflection</small></button>`).join('');
 $$('.yearCard').forEach(b=>b.addEventListener('click',()=>{const y=b.dataset.yearJump;scrollTo('projects');setTimeout(()=>{const btn=$(`#yearFilters button[data-year="${y}"]`);btn?.click()},350)}));
 $('#yearSummary').textContent=`${Math.min(4,Math.max(1,new Date().getFullYear()-(p.start_year||new Date().getFullYear())+1))} / 4`;renderFeatured();buildSkillFilterOptions();applyFilters();renderSkills(d.skills||[]);renderPracticums(d.practicums||[]);renderReflections(d.reflections||[]);renderDocuments(d.documents||[]);renderInsights(d);$('#contactInfo').innerHTML=[['อีเมล',p.email],['โทรศัพท์',p.phone],['Facebook',p.facebook],['LINE',p.line_id]].map(x=>`<div class="contactLine"><b>${x[0]}</b><div>${esc(x[1]||'—')}</div></div>`).join('');
 ['journey','projects','professional','growth','documents','skills','contact'].forEach(id=>{const key={journey:'show_journey',projects:'show_projects',professional:'show_practicums',growth:'show_reflections',documents:'show_documents',skills:'show_skills',contact:'show_contact'}[id];document.getElementById(id).classList.toggle('hidden',s[key]===false)});
 if(p.resume_url){$('#heroResume').href=safeUrl(p.resume_url);$('#heroResume').classList.remove('hidden')}else $('#heroResume').classList.add('hidden');
 if(s.maintenance_mode){document.body.classList.add('maintenanceMode');$('#mainContent').innerHTML=`<section><div class="wrap empty maintenanceCard"><h2>เว็บไซต์อยู่ระหว่างปรับปรุง</h2><p>${esc(s.maintenance_message||'กรุณากลับมาอีกครั้งภายหลัง')}</p></div></section>`;return}else document.body.classList.remove('maintenanceMode');
 maybeOpenFromHash();applyMode();
}
function projectCard(x){return `<article class="card project" data-open="${esc(x.id)}"><div class="cover" ${x.cover_url?`style="background-image:url('${encodeURI(x.cover_url)}')"`:''}>${x.cover_url?'':'0'+x.academic_year}</div><div class="projectBody"><div class="cardMeta"><span class="badge">ปี ${x.academic_year} · ${esc(x.category||'project')}</span>${x.featured?'<span class="miniStar">★</span>':''}</div><h3>${esc(x.title)}</h3><p>${esc(x.summary||'')}</p>${tagRow(toArr(x.skills).slice(0,3))}<a data-open="${esc(x.id)}">ดู Case Study →</a></div></article>`}
function buildSkillFilterOptions(){const set=new Set();projects.forEach(x=>toArr(x.skills).forEach(s=>set.add(s)));const sel=$('#skillFilter'),current=sel.value;sel.innerHTML='<option value="all">ทุกทักษะที่ใช้</option>'+[...set].sort().map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');if([...set].includes(current))sel.value=current}
function applyFilters(){const year=($('.filters button.active')||{}).dataset?.year||'all',q=$('#searchInput').value.trim().toLowerCase(),cat=$('#categoryFilter').value,sem=$('#semesterFilter').value,skill=$('#skillFilter').value,featuredOnly=$('#featuredFilter').checked;const a=projects.filter(x=>{if(year!=='all'&&String(x.academic_year)!==String(year))return false;if(cat!=='all'&&x.category!==cat)return false;if(sem!=='all'&&String(x.semester)!==String(sem))return false;if(skill!=='all'&&!toArr(x.skills).includes(skill))return false;if(featuredOnly&&!x.featured)return false;if(q){const hay=[x.title,x.title_en,x.summary,x.details,x.process,x.learnings,...toArr(x.tools),...toArr(x.skills)].join(' ').toLowerCase();if(!hay.includes(q))return false}return true});$('#projectGrid').innerHTML=a.map(projectCard).join('')||empty('ยังไม่มีผลงานตรงกับเงื่อนไขที่เลือก');$('#resultCount').textContent=`พบ ${a.length} ผลงาน`}
function renderFeatured(){const featured=projects.filter(x=>x.featured);if(featured.length){$('#featuredWrap').classList.remove('hidden');$('#featuredGrid').innerHTML=featured.map(projectCard).join('')}else $('#featuredWrap').classList.add('hidden')}
function renderSkills(skills){$('#skillGrid').innerHTML=skills.map(x=>{const level=+x.level||0,start=x.start_level==null?Math.max(0,level-25):+x.start_level,target=x.target_level==null?Math.min(100,level+20):+x.target_level;return `<article class="card skillCard"><div class="skillTop"><div><b>${esc(x.name)}</b><small>${esc(x.group_name||'Skill')}</small></div><strong>${level}%</strong></div><div class="skillTrack"><i class="start" style="width:${start}%"></i><i class="current" style="width:${level}%"></i><i class="target" style="width:${target}%"></i></div><div class="skillScale"><span>เริ่ม ${start}%</span><span>ปัจจุบัน ${level}%</span><span>เป้าหมาย ${target}%</span></div></article>`}).join('')||empty('ยังไม่มีข้อมูลทักษะ')}
function renderPracticums(items){$('#practicumGrid').innerHTML=items.map(x=>`<article class="card project"><div class="cover" ${x.cover_url?`style="background-image:url('${encodeURI(x.cover_url)}')"`:''}>${x.cover_url?'':'EDU'}</div><div class="projectBody"><span class="badge">ปี ${x.academic_year} · ${esc(x.type)}</span><h3>${esc(x.title)}</h3><p><b>${esc(x.organization)}</b></p><p>${esc(x.description)}</p>${x.evidence_url?`<a href="${safeUrl(x.evidence_url)}" target="_blank" rel="noopener">ดูหลักฐาน →</a>`:''}</div></article>`).join('')||empty('ยังไม่มีข้อมูลฝึกสอนหรือฝึกงาน')}
function renderReflections(items){$('#reflectionGrid').innerHTML=items.map(x=>`<article class="card reflectionCard"><span class="badge">ปี ${x.academic_year} · ภาคเรียน ${x.semester}</span><h3>${esc(x.title)}</h3><p><b>สิ่งที่เรียนรู้</b><br>${esc(x.learned)}</p><p class="meta"><b>เป้าหมายถัดไป</b><br>${esc(x.next_goal)}</p></article>`).join('')||empty('ยังไม่มีบันทึกการเติบโต')}
function renderDocuments(items){$('#documentGrid').innerHTML=items.map(x=>`<article class="card project"><div class="cover" ${x.cover_url?`style="background-image:url('${encodeURI(x.cover_url)}')"`:''}>${x.cover_url?'':'PDF'}</div><div class="projectBody"><span class="badge">${esc(x.type)}</span><h3>${esc(x.title)}</h3><p>${esc(x.issuer||x.description)}</p>${x.file_url?`<a href="${safeUrl(x.file_url)}" target="_blank" rel="noopener">เปิดเอกสาร →</a>`:''}</div></article>`).join('')||empty('ยังไม่มีเอกสารที่เปิดเผยต่อสาธารณะ')}
function renderInsights(d){const p=d.profile||{},items=[['CONTENT','ผลงาน',d.projects.length,6,'projects'],['SKILLS','ทักษะ',d.skills.length,6,'skills'],['EXPERIENCE','ประสบการณ์',d.practicums.length,2,'professional'],['DOCUMENTS','เอกสาร',d.documents.length,4,'documents']];$('#insightGrid').innerHTML=`<article class="insightScore"><span>PORTFOLIO HEALTH</span><strong>${healthScore(d)}</strong><em>/ 100</em><div class="scoreBar"><i style="width:${healthScore(d)}%"></i></div><p>${healthScore(d)>=85?'ภาพรวมพร้อมใช้งานระดับมืออาชีพ':healthScore(d)>=70?'ภาพรวมดี แต่อีกเล็กน้อยจะครบ':'ควรเติมข้อมูลเพื่อให้ Portfolio สมบูรณ์ขึ้น'}</p></article>`+items.map(x=>`<button class="insightCard" data-scroll="${x[4]}"><span>${x[0]}</span><strong>${x[2]}</strong><small>/ ${x[3]}</small><div class="miniBar"><i style="width:${Math.min(100,x[2]/x[3]*100)}%"></i></div><b>${x[1]} →</b></button>`).join('')+`<article class="insightNote"><span>RECOMMENDATION</span><h3>${p.resume_url?'Resume พร้อมแล้ว':'เพิ่ม Resume เพื่อให้โปรไฟล์พร้อมสมัครงาน'}</h3><p>${p.photo_url?'รูปโปรไฟล์พร้อมแล้ว':'เพิ่มรูปโปรไฟล์เพื่อสร้างภาพจำในหน้าแรก'} · ${d.projects.length?'มีผลงานให้ดูแล้ว':'เพิ่ม Project แรก'} · ${d.skills.length?'มี Skill Map':'เพิ่มทักษะ'}</p></article>`;$$('.insightCard').forEach(b=>b.addEventListener('click',()=>scrollTo(b.dataset.scroll)))}

$('#yearFilters').onclick=e=>{if(!e.target.dataset.year)return;$$('.filters button').forEach(x=>x.classList.toggle('active',x===e.target));applyFilters()};$('#searchInput').addEventListener('input',applyFilters);['categoryFilter','semesterFilter','skillFilter','featuredFilter'].forEach(id=>$('#'+id).addEventListener('change',applyFilters));

document.addEventListener('click',e=>{const el=e.target.closest('[data-open]');if(el){openDetail(el.dataset.open)}});
function openDetail(id){const x=projects.find(v=>String(v.id)===String(id));if(!x)return;$('#detailTitle').textContent=x.title;const gallery=toArr(x.gallery_urls);$('#detailBody').innerHTML=`${x.cover_url?`<img class="detailCover" src="${safeUrl(x.cover_url)}" alt="${esc(x.title)}">`:''}<div class="detailMeta"><span class="badge">ปี ${x.academic_year}${x.semester?` · ภาคเรียน ${x.semester}`:''}</span><span class="badge">${esc(x.category||'')}</span>${x.featured?'<span class="badge">ผลงานเด่น</span>':''}</div>${[['ที่มาและปัญหาของโครงงาน',x.problem],['บทบาทของฉัน',x.role],['ขั้นตอนการทำงาน',x.process],['รายละเอียดเพิ่มเติม',x.details],['สิ่งที่ได้เรียนรู้',x.learnings],['Reflection หลังจบผลงาน',x.reflection]].map(([h,v])=>v?`<div class="detailSection"><h4>${h}</h4><p>${esc(v)}</p></div>`:'').join('')}${toArr(x.tools).length?`<div class="detailSection"><h4>เครื่องมือและเทคโนโลยี</h4>${tagRow(toArr(x.tools))}</div>`:''}${toArr(x.skills).length?`<div class="detailSection"><h4>ทักษะที่ใช้</h4>${tagRow(toArr(x.skills))}</div>`:''}${x.video_url?`<div class="detailSection"><h4>วิดีโอผลงาน</h4><video class="detailVideo" src="${safeUrl(x.video_url)}" controls></video></div>`:''}${gallery.length?`<div class="detailSection"><h4>รูปภาพผลงาน</h4><div class="galleryGrid">${gallery.map(g=>`<img src="${safeUrl(g)}" alt="${esc(x.title)}">`).join('')}</div></div>`:''}<div class="detailLinks">${x.github_url?`<a class="button" href="${safeUrl(x.github_url)}" target="_blank" rel="noopener">GitHub →</a>`:''}${x.external_url?`<a class="button" href="${safeUrl(x.external_url)}" target="_blank" rel="noopener">เว็บไซต์ผลงาน →</a>`:''}</div>`;$('#detailOverlay').classList.add('open');history.replaceState(null,'','#project-'+x.id);trackEvent('project_view',x.id)}
function closeDetail(){ $('#detailOverlay').classList.remove('open'); if(location.hash.startsWith('#project-'))history.replaceState(null,'','#projects') }
$('#detailClose').onclick=closeDetail;$('#detailOverlay').addEventListener('click',e=>{if(e.target.id==='detailOverlay')closeDetail()});function maybeOpenFromHash(){const m=location.hash.match(/^#project-(.+)$/);if(m)openDetail(m[1])}window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#project-'))maybeOpenFromHash()});

function openShare(){const url=location.href.split('#')[0];$('#shareLink').value=url;$('#shareFb').href='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url);$('#shareLine').href='https://social-plugins.line.me/lineit/share?url='+encodeURIComponent(url);const qr='https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data='+encodeURIComponent(url);$('#qrImg').src=qr;$('#qrDownload').href=qr;$('#shareModal').classList.add('open');trackEvent('share_open')}
$('#shareBtn').onclick=openShare;$('#shareBtnFooter').onclick=openShare;$('#shareClose').onclick=()=>$('#shareModal').classList.remove('open');$('#shareModal').addEventListener('click',e=>{if(e.target.id==='shareModal')$('#shareModal').classList.remove('open')});$('#copyLinkBtn').onclick=async()=>{try{await navigator.clipboard.writeText($('#shareLink').value);$('#copyLinkBtn').textContent='คัดลอกแล้ว ✓';setTimeout(()=>$('#copyLinkBtn').textContent='คัดลอก',1600)}catch{$('#shareLink').select();document.execCommand('copy')}};

function applyMode(){document.body.dataset.mode=currentMode;$('#modeToggle').textContent=currentMode==='teacher'?'Teacher':currentMode==='presentation'?'Presentation':'Recruiter'}
$('#modeToggle').onclick=()=>{currentMode=currentMode==='recruiter'?'teacher':'recruiter';localStorage.setItem('portfolio_mode',currentMode);applyMode();trackEvent('mode_change')};

const commands=[
 ['ดูผลงาน','เปิด Projects','#projects','P'],['ดูเส้นทาง 4 ปี','เปิด Journey','#journey','J'],['ดูทักษะ','เปิด Skill Evolution','#skills','S'],['ดูประสบการณ์','เปิด Professional Experience','#professional','E'],['ดูเอกสาร','เปิด Documents','#documents','D'],['ติดต่อ','เปิด Contact','#contact','C'],['Recruiter Mode','โหมดสำหรับงาน/ฝึกงาน','mode:recruiter','R'],['Teacher Mode','โหมดเน้นประสบการณ์การสอน','mode:teacher','T'],['Presentation Mode','เปิดโหมดนำเสนอ','presentation','▶'],['Resume','เปิด Resume','resume','↗'],['แชร์ Portfolio','เปิดเมนูแชร์','share','↗']
];
function renderCommands(filter=''){const f=filter.toLowerCase();const list=commands.filter(c=>(c[0]+' '+c[1]).toLowerCase().includes(f));$('#commandList').innerHTML=list.map((c,i)=>`<button class="commandItem ${i===commandIndex?'selected':''}" data-cmd="${esc(c[2])}"><span><b>${esc(c[0])}</b><small>${esc(c[1])}</small></span><kbd>${esc(c[3])}</kbd></button>`).join('')||empty('ไม่พบคำสั่ง') ;$$('.commandItem').forEach((b,i)=>b.onclick=()=>runCommand(b.dataset.cmd,i))}
function openCommand(){commandIndex=0;$('#commandModal').classList.add('open');$('#commandInput').value='';renderCommands();setTimeout(()=>$('#commandInput').focus(),0)}
function closeCommand(){$('#commandModal').classList.remove('open')}
function runCommand(cmd){closeCommand();if(cmd.startsWith('#'))return scrollTo(cmd.slice(1));if(cmd==='mode:recruiter'||cmd==='mode:teacher'){currentMode=cmd.split(':')[1];localStorage.setItem('portfolio_mode',currentMode);applyMode();return}if(cmd==='presentation')return openPresentation();if(cmd==='resume')return window.open('resume.html','_blank','noopener');if(cmd==='share')return openShare()}
$('#commandBtn').onclick=openCommand;$('#commandClose').onclick=closeCommand;$('#commandModal').addEventListener('click',e=>{if(e.target.id==='commandModal')closeCommand()});$('#commandInput').oninput=e=>{commandIndex=0;renderCommands(e.target.value)};$('#commandInput').onkeydown=e=>{const items=$$('.commandItem');if(e.key==='ArrowDown'){e.preventDefault();commandIndex=Math.min(items.length-1,commandIndex+1);renderCommands(e.target.value)}else if(e.key==='ArrowUp'){e.preventDefault();commandIndex=Math.max(0,commandIndex-1);renderCommands(e.target.value)}else if(e.key==='Enter'){e.preventDefault();items[commandIndex]?.click()}else if(e.key==='Escape')closeCommand()};document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCommand()} });

const slides=()=>{const p=profile,d=siteData;return[
 {ey:'01 · INTRO',title:p.name_th||'Portfolio',text:p.headline||'',meta:p.intro||'',stats:[`${projects.length} Projects`,` ${d.skills?.length||0} Skills`,`Year ${Math.max(1,Math.min(4,new Date().getFullYear()-(p.start_year||new Date().getFullYear())+1))}`]},
 {ey:'02 · JOURNEY',title:'4-Year Learning Journey',text:'จากพื้นฐานสู่การสร้างประสบการณ์การเรียนรู้',meta:(d.reflections||[]).length?`${d.reflections.length} reflections`: 'กำลังสะสม Reflection',stats:[1,2,3,4].map(y=>`Year ${y} · ${projects.filter(x=>+x.academic_year===y).length} projects` )},
 {ey:'03 · SELECTED WORK',title:'Case Studies',text:'ผลงานที่เล่าด้วยปัญหา วิธีคิด และผลลัพธ์',meta:'',stats:projects.slice(0,4).map((x,i)=>`${String(i+1).padStart(2,'0')} · ${x.title}`)},
 {ey:'04 · SKILLS',title:'Skill Evolution',text:'ทักษะที่พัฒนาขึ้นระหว่างทาง',meta:'',stats:(d.skills||[]).slice(0,4).map(x=>`${x.name} · ${x.level}%`)},
 {ey:'05 · EXPERIENCE',title:'Professional Readiness',text:'ฝึกสอน ฝึกงาน กิจกรรม และหลักฐานการลงมือทำ',meta:'',stats:[`Experience ${d.practicums?.length||0}`,`Documents ${d.documents?.length||0}`,`Reflections ${d.reflections?.length||0}`]},
 {ey:'06 · CONTACT',title:'Let’s build something meaningful.',text:p.email||'',meta:p.bio||'',stats:['Portfolio','Resume','Contact']}
]};
function renderSlide(){const a=slides(),s=a[presentationIndex];$('#presentationCounter').textContent=`${String(presentationIndex+1).padStart(2,'0')} / ${String(a.length).padStart(2,'0')}`;$('#presentationSlide').innerHTML=`<div class="presentationEyebrow">${esc(s.ey)}</div><h2>${esc(s.title)}</h2><p class="presentationLead">${esc(s.text)}</p><p class="presentationMeta">${esc(s.meta)}</p><div class="presentationStats">${s.stats.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`;$('#presentationPrev').disabled=presentationIndex===0;$('#presentationNext').textContent=presentationIndex===a.length-1?'ปิด':'ถัดไป →'}
function openPresentation(){presentationIndex=0;$('#presentationModal').classList.add('open');renderSlide();trackEvent('presentation_open')}
function closePresentation(){ $('#presentationModal').classList.remove('open') }
$('#presentationBtn').onclick=openPresentation;$('#timelineModeBtn').onclick=()=>{$('#timelineBody').innerHTML=[1,2,3,4].map(y=>{const ps=projects.filter(x=>+x.academic_year===y),rs=(siteData.reflections||[]).filter(x=>+x.academic_year===y);return `<div class="timelineItem"><div class="timelineDot">0${y}</div><div><h3>Year ${y}</h3><p>${['พื้นฐานและการปรับตัว','ต่อยอดทักษะและโครงงาน','ประสบการณ์วิชาชีพ','สรุปการเติบโตและฝึกสอน'][y-1]}</p><small>${ps.length} projects · ${rs.length} reflections</small></div></div>`}).join('');$('#timelineModal').classList.add('open')};
$('#timelineClose').onclick=()=>$('#timelineModal').classList.remove('open');$('#presentationClose').onclick=closePresentation;$('#presentationPrev').onclick=()=>{if(presentationIndex>0){presentationIndex--;renderSlide()}};$('#presentationNext').onclick=()=>{if(presentationIndex>=slides().length-1)closePresentation();else{presentationIndex++;renderSlide()}};$('#presentationModal').addEventListener('click',e=>{if(e.target.id==='presentationModal')closePresentation()});document.addEventListener('keydown',e=>{if(!$('#presentationModal').classList.contains('open'))return;if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();$('#presentationNext').click()}if(e.key==='ArrowLeft'){e.preventDefault();$('#presentationPrev').click()}if(e.key==='Escape')closePresentation()});

const formLoadedAt=Date.now();$('#contactForm').onsubmit=async e=>{e.preventDefault();const out=$('#formStatus'),fd=new FormData(e.target);if(fd.get('website')){out.className='ok';out.textContent='ส่งข้อความเรียบร้อย ขอบคุณครับ';e.target.reset();return}if(Date.now()-formLoadedAt<1800){out.className='error';out.textContent='กรุณาลองส่งใหม่อีกครั้ง';return}if(!sb){out.className='error';out.textContent='Demo mode: ตั้งค่า Supabase ก่อนรับข้อความจริง';return}out.textContent='กำลังส่ง…';const payload=Object.fromEntries(fd);delete payload.website;const {error}=await sb.from('messages').insert(payload);out.className=error?'error':'ok';out.textContent=error?error.message:'ส่งข้อความเรียบร้อย ขอบคุณครับ';if(!error){e.target.reset();trackEvent('contact_submit')}};

applyMode();load();
