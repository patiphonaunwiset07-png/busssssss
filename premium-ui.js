(() => {
 const password=document.getElementById('loginPassword'),toggle=document.getElementById('passwordToggle'),email=document.getElementById('loginEmail'),remember=document.getElementById('rememberEmail');
 toggle.addEventListener('click',()=>{const show=password.type==='password';password.type=show?'text':'password';toggle.setAttribute('aria-pressed',String(show));toggle.setAttribute('aria-label',show?'ซ่อนรหัสผ่าน':'แสดงรหัสผ่าน');});
 try{const saved=localStorage.getItem('portfolio-remembered-email');if(saved){email.value=saved;remember.checked=true;}}catch{}
 document.getElementById('loginForm').addEventListener('submit',()=>{try{if(remember.checked)localStorage.setItem('portfolio-remembered-email',email.value.trim());else localStorage.removeItem('portfolio-remembered-email');}catch{}});
 remember.addEventListener('change',()=>{if(!remember.checked)try{localStorage.removeItem('portfolio-remembered-email');}catch{}});
})();
