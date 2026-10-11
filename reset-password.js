import {SUPABASE_URL,SUPABASE_ANON_KEY,CONFIGURED} from './config.js';
const form=document.getElementById('resetForm'),button=document.getElementById('resetSubmit'),status=document.getElementById('resetStatus');
let sb,canReset=false;
try{
 if(!CONFIGURED)throw new Error('กรุณาตั้งค่า Supabase ใน config.js');
 const recovery=new URLSearchParams(location.hash.slice(1)).get('type')==='recovery';
 const {createClient}=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
 sb=createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
 sb.auth.onAuthStateChange(event=>{if(event==='PASSWORD_RECOVERY'){canReset=true;button.disabled=false;status.textContent='กรอกรหัสผ่านใหม่ของคุณ';}});
 const {data:{session},error}=await sb.auth.getSession();if(error)throw error;
 if(recovery&&session){canReset=true;button.disabled=false;status.textContent='กรอกรหัสผ่านใหม่ของคุณ';}
 else if(!canReset){status.textContent='กรุณาเปิดหน้านี้จากลิงก์ตั้งรหัสผ่านในอีเมล หากลิงก์หมดอายุให้ขอใหม่';}
}catch(error){status.className='loginStatus error';status.textContent=error.message||'ไม่สามารถตรวจสอบลิงก์ได้';}
form.addEventListener('submit',async event=>{
 event.preventDefault();if(!canReset||!sb)return;
 const fields=new FormData(form),password=String(fields.get('password'));
 if(password!==fields.get('confirm')){status.textContent='รหัสผ่านทั้งสองช่องไม่ตรงกัน';return}
 button.disabled=true;
 try{const {error}=await sb.auth.updateUser({password});if(error)throw error;await sb.auth.signOut();canReset=false;form.reset();status.textContent='ตั้งรหัสผ่านใหม่แล้ว กลับไปเข้าสู่ระบบด้วยรหัสผ่านใหม่';}
 catch(error){status.className='loginStatus error';status.textContent=error.message||'บันทึกไม่สำเร็จ';button.disabled=false}
});
