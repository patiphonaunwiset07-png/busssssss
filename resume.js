import { SUPABASE_URL, SUPABASE_ANON_KEY, CONFIGURED } from './config.js';
let createClient;if(CONFIGURED)({createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'));
const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const sb=CONFIGURED?createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
function toArr(v){return Array.isArray(v)?v:(v?String(v).split(',').map(x=>x.trim()).filter(Boolean):[])}

async function load(){
  let profile=null,projects=[],skills=[],practicums=[];
  if(sb){
    const rs=await Promise.all([
      sb.from('profiles').select('*').eq('id',1).single(),
      sb.from('projects').select('*').eq('published',true).order('academic_year').order('sort_order'),
      sb.from('skills').select('*').eq('published',true).order('sort_order'),
      sb.from('practicums').select('*').eq('published',true).order('academic_year').order('sort_order')
    ]);
    if(!rs.some(x=>x.error)){profile=rs[0].data;projects=rs[1].data||[];skills=rs[2].data||[];practicums=rs[3].data||[]}
  }
  if(!profile){$('#resumeDoc').innerHTML='<div class="empty">ไม่พบข้อมูลโปรไฟล์ — กรุณาตั้งค่า Supabase หรือกรอกข้อมูลใน Admin ก่อน</div>';return}
  render(profile,projects,skills,practicums);
  if(new URLSearchParams(location.search).get('auto')==='1')setTimeout(()=>window.print(),400);
}

function render(p,projects,skills,practicums){
  document.title=`Resume — ${p.name_en||p.name_th}`;
  const featured=projects.filter(x=>x.featured).slice(0,6);
  const list=featured.length?featured:projects.slice(0,6);
  $('#resumeDoc').innerHTML=`
    <header class="resumeHead">
      ${p.photo_url?`<img class="resumePhoto" src="${encodeURI(p.photo_url)}" alt="">`:''}
      <div>
        <h1>${esc(p.name_th)}${p.name_en?` · ${esc(p.name_en)}`:''}</h1>
        <p class="resumeHeadline">${esc(p.headline||'')}</p>
        <p class="resumeContact">${[p.email,p.phone,p.facebook,p.line_id].filter(Boolean).join(' · ')}</p>
        ${p.university||p.faculty||p.major?`<p class="resumeContact">${[p.university,p.faculty,p.major].filter(Boolean).join(' · ')}</p>`:''}
      </div>
    </header>
    ${p.bio?`<section class="resumeSection"><h2>เกี่ยวกับฉัน</h2><p>${esc(p.bio)}</p></section>`:''}
    ${skills.length?`<section class="resumeSection"><h2>ทักษะ</h2><div class="tagRow">${skills.map(x=>`<span class="tag">${esc(x.name)} · ${x.level}%</span>`).join('')}</div></section>`:''}
    ${list.length?`<section class="resumeSection"><h2>ผลงานเด่น</h2>${list.map(x=>`<div class="resumeItem"><b>${esc(x.title)}</b><span>ปี ${x.academic_year} · ${esc(x.category||'')}</span><p>${esc(x.summary||'')}</p>${toArr(x.tools).length?`<div class="tagRow">${toArr(x.tools).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`:''}</div>`).join('')}</section>`:''}
    ${practicums.length?`<section class="resumeSection"><h2>ประสบการณ์ฝึกสอน / ฝึกงาน</h2>${practicums.map(x=>`<div class="resumeItem"><b>${esc(x.title)}</b><span>${esc(x.organization||'')} · ปี ${x.academic_year}</span><p>${esc(x.description||'')}</p></div>`).join('')}</section>`:''}
    <p class="resumeFooter">สร้างจากข้อมูล Portfolio อัตโนมัติ · ${new Date().toLocaleDateString('th-TH')}</p>
  `;
}
$('#printBtn').onclick=()=>window.print();
load();
