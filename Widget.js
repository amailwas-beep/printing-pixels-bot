
// printing-pixels.com widget - Codex compatible
(function(){
  const cfg = window.PRINTING_PIXELS_BOT || {};
  const apiUrl = cfg.apiUrl || '/chat';
  const color = cfg.primaryColor || '#D4AF37';
  const btn = document.createElement('div');
  btn.innerHTML = '<div style="position:fixed;bottom:20px;right:20px;width:60px;height:60px;background:'+color+';border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.3);z-index:9999;font-weight:bold;">P</div>';
  document.body.appendChild(btn);
  let open=false;
  btn.onclick = () => {
    if(!open){
      const box = document.createElement('div');
      box.id='pp-chat';
      box.style='position:fixed;bottom:90px;right:20px;width:340px;height:420px;background:#0A0A0A;border:1px solid #333;border-radius:16px;z-index:9999;display:flex;flex-direction:column;overflow:hidden;';
      box.innerHTML = '<div style="padding:12px;background:'+color+';color:#000;font-weight:bold;">Printing Pixels - Your ideas, made visible.</div><div id="pp-msgs" style="flex:1;overflow:auto;padding:12px;color:#fff;font-size:13px;"></div><div style="display:flex;padding:8px;gap:6px;"><input id="pp-in" placeholder="Ask price, size, deadline..." style="flex:1;padding:10px;border-radius:8px;border:1px solid #333;background:#111;color:#fff;"><button id="pp-send" style="background:'+color+';border:none;padding:10px 14px;border-radius:8px;font-weight:bold;cursor:pointer;">Send</button></div>';
      document.body.appendChild(box);
      const send = async () => {
        const inp = document.getElementById('pp-in');
        const msgs = document.getElementById('pp-msgs');
        const txt = inp.value;
        if(!txt) return;
        msgs.innerHTML += '<div style="margin:6px 0;text-align:right;"><span style="background:#222;padding:8px 10px;border-radius:12px;display:inline-block;">'+txt+'</span></div>';
        inp.value='';
        try{
          const r = await fetch(apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:txt})});
          const j = await r.json();
          msgs.innerHTML += '<div style="margin:6px 0;"><span style="background:#1a1a1a;border:1px solid #333;padding:8px 10px;border-radius:12px;display:inline-block;white-space:pre-wrap;">'+j.reply+'</span></div>';
          msgs.scrollTop = msgs.scrollHeight;
        }catch(e){ msgs.innerHTML += '<div style="color:#ff5555;">Error connecting to bot. Check Railway URL.</div>'; }
      };
      document.getElementById('pp-send').onclick=send;
      document.getElementById('pp-in').onkeypress=(e)=>{ if(e.key==='Enter') send(); };
      open=true; box.dataset.open='1';
    } else {
      const b=document.getElementById('pp-chat'); if(b) b.remove(); open=false;
    }
  };
})();
