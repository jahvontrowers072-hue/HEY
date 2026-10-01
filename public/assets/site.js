(function(){
"use strict";

/* ─────────────────────────────────────────────────────────────
   SITE SETTINGS
   API_URL: the address of your deployed backend (no slash at the end),
   e.g. "https://cn-spotless-backend.vercel.app". Visitor tracking and the
   quote form send to it. Left blank, the form falls back to opening a
   pre-filled email and nothing is tracked.
   ───────────────────────────────────────────────────────────── */
var API_URL = "";
var FORM_ENDPOINT = API_URL ? API_URL + "/api/quote" : "";
var BUSINESS_EMAIL = "clayontrowers6@gmail.com";

var $  = function(s,c){ return (c||document).querySelector(s); };
var $$ = function(s,c){ return Array.prototype.slice.call((c||document).querySelectorAll(s)); };
var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- year ---------- */
var yr = $("#yr"); if(yr) yr.textContent = new Date().getFullYear();
$$(".today").forEach(function(el){
  el.textContent = new Date().toLocaleDateString(undefined,{year:"numeric",month:"long",day:"numeric"});
});

/* ---------- hero video: respect reduced motion ---------- */
var heroVid = $(".hero-media video");
if(heroVid && reduce){ try{ heroVid.pause(); }catch(e){} }

/* ---------- sticky nav + mobile call bar ---------- */
var nav = $("#nav"), mbar = $("#mbar"), heroEl = $(".hero"), quoteEl = $("#quote");
var onScroll = function(){
  var y = window.scrollY;
  nav.classList.toggle("scrolled", y > 24);
  if(mbar){
    var pastHero = y > (heroEl ? heroEl.offsetHeight * 0.6 : 200);
    var q = quoteEl ? quoteEl.getBoundingClientRect() : null;
    var atForm = !!q && q.top < window.innerHeight && q.bottom > 0;
    mbar.classList.toggle("show", pastHero && !atForm);
  }
};
onScroll();
window.addEventListener("scroll", onScroll, {passive:true});

/* ---------- mobile drawer ---------- */
var burger = $("#burger"), drawer = $("#drawer"), drawerLinks = $$("#drawer a"), lastFocus = null;
function setDrawer(open){
  nav.classList.toggle("menu-open", open);
  drawer.classList.toggle("open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("is-locked", open);
  if(open){
    lastFocus = document.activeElement;
    drawerLinks.forEach(function(a,i){ a.style.animationDelay = (0.05 + i*0.045) + "s"; });
    var first = $("#drawer a"); if(first) setTimeout(function(){ first.focus(); }, 60);
  } else if(lastFocus){ lastFocus.focus(); }
}
burger.addEventListener("click", function(){ setDrawer(!drawer.classList.contains("open")); });
$$("#drawer a, #drawer .btn").forEach(function(a){
  a.addEventListener("click", function(){ setDrawer(false); });
});
document.addEventListener("keydown", function(e){
  if(e.key === "Escape" && drawer.classList.contains("open")) setDrawer(false);
  if(e.key === "Tab" && drawer.classList.contains("open")){
    var f = $$("a, button", drawer).filter(function(el){ return el.offsetParent !== null; });
    if(!f.length) return;
    var first = f[0], last = f[f.length-1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }
});

/* ---------- smooth scroll with sticky-nav offset ---------- */
$$('a[href^="#"]').forEach(function(a){
  a.addEventListener("click", function(e){
    var id = a.getAttribute("href");
    if(!id || id === "#" || a.hasAttribute("data-modal")) return;
    var t = document.querySelector(id);
    if(!t) return;
    e.preventDefault();
    var off = nav.offsetHeight - 1;
    var y = t.getBoundingClientRect().top + window.pageYOffset - (id === "#top" ? 0 : off);
    window.scrollTo({ top: Math.max(0,y), behavior: reduce ? "auto" : "smooth" });
    if(history.replaceState) history.replaceState(null,"",id);
  });
});

/* ---------- reveal on scroll ---------- */
var rvs = $$(".rv");
if("IntersectionObserver" in window && !reduce){
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { rootMargin:"0px 0px -10% 0px", threshold:0.08 });
  rvs.forEach(function(el){ io.observe(el); });
  // safety net — if the observer never fires (thumbnail capture, odd viewport),
  // make sure nothing is left stranded at opacity 0.
  setTimeout(function(){ rvs.forEach(function(el){ el.classList.add("in"); }); }, 2600);
} else {
  rvs.forEach(function(el){ el.classList.add("in"); });
}

/* ---------- scroll spy ---------- */
var navAnchors = $$(".nav-links a");
var spyIds = navAnchors.map(function(a){ return a.getAttribute("href"); })
                       .filter(function(h){ return h && h.charAt(0) === "#" && h.length > 1 && document.querySelector(h); });
if("IntersectionObserver" in window && spyIds.length){
  var spy = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting) return;
      navAnchors.forEach(function(a){
        a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + en.target.id));
      });
    });
  }, { rootMargin:"-45% 0px -50% 0px" });
  spyIds.forEach(function(h){ spy.observe(document.querySelector(h)); });
}

/* ---------- shade visualiser ---------- */
(function(){
  var stage = $("#stage"); if(!stage) return;
  var filmL = $("#filmL"), filmR = $("#filmR"),
      tagL = $("#tagL"), tagR = $("#tagR"), handle = $("#handle"),
      btns = $$(".vlt");
  var split = 50, dragging = false;

  function applySplit(p){
    split = Math.max(0, Math.min(100, p));
    stage.style.setProperty("--split", split + "%");
    stage.setAttribute("aria-valuenow", Math.round(split));
    stage.setAttribute("aria-valuetext", "Comparison split at " + Math.round(split) + " percent");
  }
  function pointTo(clientX){
    var r = stage.getBoundingClientRect();
    applySplit(((clientX - r.left) / r.width) * 100);
  }
  stage.addEventListener("pointerdown", function(e){
    dragging = true;
    stage.setPointerCapture(e.pointerId);
    handle.style.transition = "none";
    pointTo(e.clientX);
  });
  stage.addEventListener("pointermove", function(e){
    if(!dragging) return;
    e.preventDefault();
    pointTo(e.clientX);
  });
  ["pointerup","pointercancel"].forEach(function(ev){
    stage.addEventListener(ev, function(e){
      if(!dragging) return;
      dragging = false;
      try{ stage.releasePointerCapture(e.pointerId); }catch(err){}
      handle.style.transition = "";
    });
  });
  stage.addEventListener("keydown", function(e){
    var step = e.shiftKey ? 10 : 4;
    if(e.key === "ArrowLeft"){ e.preventDefault(); applySplit(split - step); }
    else if(e.key === "ArrowRight"){ e.preventDefault(); applySplit(split + step); }
    else if(e.key === "Home"){ e.preventDefault(); applySplit(0); }
    else if(e.key === "End"){ e.preventDefault(); applySplit(100); }
  });

  btns.forEach(function(b){
    b.addEventListener("click", function(){
      btns.forEach(function(o){ o.setAttribute("aria-pressed","false"); });
      b.setAttribute("aria-pressed","true");
      filmR.style.opacity = b.getAttribute("data-op");
      tagR.textContent = b.getAttribute("data-label");
      if(split > 92) applySplit(55);
    });
  });
  applySplit(50);
})();

/* ---------- FAQ accordion ---------- */
$$(".faq-q").forEach(function(btn){
  var panel = btn.nextElementSibling;
  var id = "faq-p-" + Math.random().toString(36).slice(2,8);
  panel.id = id;
  btn.setAttribute("aria-controls", id);
  panel.setAttribute("data-open","false");
  btn.addEventListener("click", function(){
    var open = btn.getAttribute("aria-expanded") === "true";
    $$(".faq-q").forEach(function(o){
      if(o !== btn){
        o.setAttribute("aria-expanded","false");
        o.nextElementSibling.setAttribute("data-open","false");
      }
    });
    btn.setAttribute("aria-expanded", String(!open));
    panel.setAttribute("data-open", String(!open));
  });
});

/* ---------- gallery lightbox ---------- */
(function(){
  var gal = $("#gallery"); if(!gal) return;
  var items = $$("button", gal).map(function(b){
    var img = $("img", b), cap = $("figcaption", b);
    return {
      el: b,
      img: img,
      title: cap ? $("b",cap).textContent : "",
      sub:   cap ? $("span",cap).textContent : "",
      alt:   img.getAttribute("alt") || ""
    };
  });
  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbTitle = $("#lbTitle"),
      lbSub = $("#lbSub"), lbCount = $("#lbCount");
  var idx = 0, opener = null;

  function show(i){
    idx = (i + items.length) % items.length;
    var it = items[idx];
    lbImg.src = it.img.getAttribute("data-full") || it.img.currentSrc || it.img.src;
    lbImg.alt = it.alt;
    lbTitle.textContent = it.title;
    lbSub.textContent = it.sub;
    lbCount.textContent = (idx+1) + " / " + items.length;
  }
  function open(i){
    opener = document.activeElement;
    show(i);
    lb.classList.add("open");
    lb.setAttribute("aria-hidden","false");
    document.body.classList.add("is-locked");
    $("#lbClose").focus();
  }
  function close(){
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden","true");
    document.body.classList.remove("is-locked");
    if(opener) opener.focus();
  }
  items.forEach(function(it,i){ it.el.addEventListener("click", function(){ open(i); }); });
  var more = $("#galMore");
  if(more){
    var total = items.length;
    more.textContent = "View all " + total + " installs";
    more.addEventListener("click", function(){
      var open = gal.classList.toggle("collapsed") === false;
      more.setAttribute("aria-expanded", String(open));
      more.textContent = open ? "Show fewer" : "View all " + total + " installs";
      if(open){ $$(".more", gal).forEach(function(el){ el.classList.add("in"); }); }
      else { gal.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block:"start" }); }
    });
  }
  $("#lbClose").addEventListener("click", close);
  $("#lbPrev").addEventListener("click", function(){ show(idx-1); });
  $("#lbNext").addEventListener("click", function(){ show(idx+1); });
  lb.addEventListener("click", function(e){ if(e.target === lb) close(); });
  document.addEventListener("keydown", function(e){
    if(!lb.classList.contains("open")) return;
    if(e.key === "Escape") close();
    else if(e.key === "ArrowLeft") show(idx-1);
    else if(e.key === "ArrowRight") show(idx+1);
    else if(e.key === "Tab"){
      var f = $$("button", lb);
      var first = f[0], last = f[f.length-1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });
  // swipe on touch
  var sx = null;
  lb.addEventListener("touchstart", function(e){ sx = e.touches[0].clientX; }, {passive:true});
  lb.addEventListener("touchend", function(e){
    if(sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if(Math.abs(dx) > 55) show(idx + (dx < 0 ? 1 : -1));
    sx = null;
  }, {passive:true});
})();

/* ---------- legal modals ---------- */
(function(){
  var opener = null;
  function openModal(m){
    opener = document.activeElement;
    m.classList.add("open");
    m.setAttribute("aria-hidden","false");
    document.body.classList.add("is-locked");
    var c = $(".modal-close", m); if(c) c.focus();
  }
  function closeModal(m){
    m.classList.remove("open");
    m.setAttribute("aria-hidden","true");
    document.body.classList.remove("is-locked");
    if(opener) opener.focus();
  }
  $$("[data-modal]").forEach(function(a){
    a.addEventListener("click", function(e){
      e.preventDefault();
      var m = document.getElementById("m-" + a.getAttribute("data-modal"));
      if(m) openModal(m);
    });
  });
  $$(".modal").forEach(function(m){
    $$("[data-close]", m).forEach(function(b){ b.addEventListener("click", function(){ closeModal(m); }); });
    m.addEventListener("click", function(e){ if(e.target === m) closeModal(m); });
  });
  document.addEventListener("keydown", function(e){
    if(e.key !== "Escape") return;
    $$(".modal.open").forEach(closeModal);
  });
})();

/* ---------- quote form ---------- */
(function(){
  var form = $("#quoteForm"); if(!form) return;
  var status = $("#formStatus"), successMsg = $("#successMsg"), again = $("#againBtn");

  function fieldOf(input){ return input.closest(".field"); }
  function setErr(input, bad){
    var f = fieldOf(input); if(!f) return;
    f.classList.toggle("invalid", bad);
    input.setAttribute("aria-invalid", String(bad));
  }
  function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
  function validPhone(v){ return (v.replace(/\D/g,"").length >= 7); }

  function check(input){
    var v = (input.value || "").trim();
    var bad = false;
    if(input.hasAttribute("required") && !v) bad = true;
    if(!bad && input.type === "email" && v && !validEmail(v)) bad = true;
    if(!bad && input.type === "tel" && v && !validPhone(v)) bad = true;
    setErr(input, bad);
    return !bad;
  }

  $$("input, select, textarea", form).forEach(function(input){
    input.addEventListener("blur", function(){ if(input.value.trim() || input.hasAttribute("required")) check(input); });
    input.addEventListener("input", function(){
      if(fieldOf(input) && fieldOf(input).classList.contains("invalid")) check(input);
    });
  });

  form.addEventListener("submit", function(e){
    e.preventDefault();
    status.textContent = "";
    var fields = $$("input, select, textarea", form);
    var ok = true, firstBad = null;
    fields.forEach(function(input){
      if(!check(input)){ ok = false; if(!firstBad) firstBad = input; }
    });
    if(!ok){
      status.textContent = "Please fix the highlighted fields.";
      if(firstBad) firstBad.focus();
      return;
    }

    var data = {};
    fields.forEach(function(i){ if(i.name) data[i.name] = (i.value||"").trim(); });

    var btn = $("button[type=submit]", form);
    btn.disabled = true;
    btn.style.opacity = ".6";

    function done(msg){
      successMsg.textContent = msg;
      form.classList.add("sent");
      btn.disabled = false;
      btn.style.opacity = "";
      form.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block:"center" });
    }

    if(FORM_ENDPOINT){
      fetch(FORM_ENDPOINT, {
        method:"POST",
        headers:{ "Content-Type":"text/plain" },
        body: JSON.stringify(data)
      }).then(function(r){
        return r.json().catch(function(){ return {}; }).then(function(j){
          if(!r.ok) throw new Error(j.error || "bad response");
        });
      }).then(function(){
        done("Thanks " + (data.name.split(" ")[0] || "") + ", your request is in. We'll come back to you with a shade recommendation and a price.");
      }).catch(function(err){
        btn.disabled = false;
        btn.style.opacity = "";
        var msg = err && err.message && err.message !== "bad response" && err.message !== "Failed to fetch" ? err.message + " " : "";
        status.textContent = msg + "If it keeps failing, call or text us on (954) 213-7808.";
      });
    } else {
      // No endpoint configured — hand the details to the customer's email app.
      var lines = [
        "Name: " + data.name,
        "Phone: " + data.phone,
        "Email: " + (data.email || "not given"),
        "Vehicle / property: " + data.type,
        "Service needed: " + data.service,
        "Preferred date: " + (data.date || "not given"),
        "Area / ZIP: " + (data.zip || "not given"),
        "",
        "Details:",
        (data.message || "not given")
      ].join("\n");
      var href = "mailto:" + BUSINESS_EMAIL +
                 "?subject=" + encodeURIComponent("Quote request: " + data.name + " (" + data.service + ")") +
                 "&body=" + encodeURIComponent(lines);
      var a = document.createElement("a");
      a.href = href; a.rel = "noopener"; a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(function(){ a.remove(); }, 0);
      done("Your email app should be opening with the details filled in. Hit send and it's on its way. If nothing opened, call or text us on (954) 213-7808.");
    }
  });

  again.addEventListener("click", function(){
    form.classList.remove("sent");
    form.reset();
    $$(".field", form).forEach(function(f){ f.classList.remove("invalid"); });
    status.textContent = "";
    var n = $("#f-name"); if(n) n.focus();
  });

  // don't allow past dates
  var d = $("#f-date");
  if(d){
    var t = new Date(); t.setMinutes(t.getMinutes() - t.getTimezoneOffset());
    d.min = t.toISOString().slice(0,10);
  }
})();

/* ---------- visit analytics (first-party, no cookies) ---------- */
(function(){
  if(location.protocol === "file:" || !API_URL) return;
  var owner = false;
  try{
    // The dashboard's "don't count this device" button opens the site with ?cns_owner=1 (or 0).
    var flag = new URLSearchParams(location.search).get("cns_owner");
    if(flag === "1" || flag === "0"){
      localStorage.setItem("cns_owner", flag);
      history.replaceState(null, "", location.pathname + location.hash);
    }
    owner = localStorage.getItem("cns_owner") === "1";
  }catch(e){}
  if(owner) return; // the business owner's own devices aren't counted
  try{
    var qs = new URLSearchParams(location.search);
    fetch(API_URL + "/api/visit", {
      method:"POST", keepalive:true,
      headers:{ "Content-Type":"text/plain" },
      body: JSON.stringify({ path: location.pathname, referrer: document.referrer, utm: qs.get("utm_source") || "" })
    }).catch(function(){});
  }catch(e){}

  // "On the site now": each open tab checks in every 20s while it's visible.
  // Stop pinging when hidden and the dashboard drops them within ~45s.
  var sid = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(36).slice(2);
  var timer = null;
  function ping(leaving){
    var payload = JSON.stringify({ sid: sid, path: location.pathname, leaving: !!leaving });
    if(leaving && navigator.sendBeacon){ navigator.sendBeacon(API_URL + "/api/ping", payload); return; }
    fetch(API_URL + "/api/ping", { method:"POST", keepalive:true, headers:{ "Content-Type":"text/plain" }, body: payload }).catch(function(){});
  }
  function start(){ if(timer) return; ping(false); timer = setInterval(function(){ ping(false); }, 20000); }
  function stop(){ clearInterval(timer); timer = null; }
  document.addEventListener("visibilitychange", function(){ document.hidden ? stop() : start(); });
  window.addEventListener("pagehide", function(){ stop(); ping(true); });
  if(!document.hidden) start();
})();

})();
