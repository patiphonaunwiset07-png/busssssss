/* Keep menus predictable when resizing and keep their expanded state accessible. */
window.addEventListener('load',()=>{
 const menu=document.getElementById('menu'),nav=document.getElementById('navlinks');
 const adminMenu=document.getElementById('adminMenuToggle'),sidebar=document.querySelector('.sidebar');
 const sync=()=>{
  if(menu&&nav){menu.setAttribute('aria-controls','navlinks');menu.setAttribute('aria-expanded',String(nav.classList.contains('open')));}
  if(adminMenu&&sidebar){adminMenu.setAttribute('aria-controls','sideNav');adminMenu.setAttribute('aria-expanded',String(sidebar.classList.contains('menuOpen')));}
 };
 menu?.addEventListener('click',()=>queueMicrotask(sync));
 adminMenu?.addEventListener('click',()=>queueMicrotask(sync));
 nav?.addEventListener('click',event=>{if(event.target.closest('a')){nav.classList.remove('open');sync();}});
 sidebar?.addEventListener('click',()=>queueMicrotask(sync));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){nav?.classList.remove('open');sidebar?.classList.remove('menuOpen');sync();}});
 const wide=matchMedia('(min-width:1441px)'),adminWide=matchMedia('(min-width:921px)');
 wide.addEventListener('change',()=>{nav?.classList.remove('open');sync();});
 adminWide.addEventListener('change',()=>{sidebar?.classList.remove('menuOpen');sync();});
 sync();
});
