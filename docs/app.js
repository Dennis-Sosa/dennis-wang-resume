'use strict';
let language = 'zh';
let activeLab = 'uplift';
let budget = 20;
let strategy = 'uplift';
let auditIndex = 0;
let auditRevealed = false;
const escapeHTML = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = 'target="_blank" rel="noopener noreferrer"';
function visual(c) {
 if(c.id==='olarion') return `<div class="project-visual audit-visual"><div class="visual-kicker">${c.visualLabel}<span>◈</span></div><div class="evidence-file"><div class="file-title"><span>pipeline.py</span><span>02 : 04</span></div><code><span class="code-muted">01</span> features = [<span class="code-green">'age'</span>,<br><span class="code-muted">02</span> &nbsp;<mark>'refund_status'</mark>]<br><span class="code-muted">03</span> model.fit(X_train, y_train)</code><div class="evidence-flag"><span>!</span>${language==='zh'?'预测时点之后的信息':'Information from after prediction time'}</div></div><div class="audit-flow">${c.steps.map((s,i)=>`<span><i>${String(i+1).padStart(2,'0')}</i>${s}</span>`).join('')}</div><div class="visual-caption">${c.visualTitle}</div></div>`;
 if(c.id==='uplift') return `<div class="project-visual uplift-visual"><div class="visual-kicker">${c.visualLabel}<span>↟</span></div><div class="uplift-graphic"><div class="uplift-bracket"><span>Δ</span><div></div></div><div class="big-metric">+12.1<span>pp</span></div><p>${c.stat1}</p><div class="metric-ruler"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="roi-line"><span>${c.stat2}</span><strong>2.18</strong></div></div><div class="visual-caption">${c.footer}</div></div>`;
 return `<div class="project-visual memory-visual"><div class="visual-kicker">${c.visualLabel}<span>∞</span></div><div class="memory-flow"><span>${language==='zh'?'一段对话':'A conversation'}</span><i>↓</i><div>${language==='zh'?'提取 · 加权 · 遗忘':'Extract · Weight · Forget'}</div><i>↓</i><span class="memory-end">${language==='zh'?'更一致的下一次回应':'A more consistent next reply'}</span></div><div class="conversation-bars"><div><small>${language==='zh'?'内测前':'BEFORE'}</small><span style="--width:56%">4.1</span></div><div><small>${language==='zh'?'内测后':'AFTER'}</small><span style="--width:100%">7.3</span></div></div><div class="visual-caption">${c.stat1}</div></div>`;
}
function renderCases() {
 const t=copy[language];
 document.getElementById('case-list').innerHTML=t.cases.map(c=>`<article class="project project-${c.id}"><div class="project-top"><div class="project-copy"><div class="case-kicker"><span>${c.n}</span>${c.type}</div><h3>${c.title}</h3><p class="project-subtitle">${c.subtitle}</p><p class="project-description">${c.description}</p><div class="tags">${c.tags.map(s=>`<span>${s}</span>`).join('')}</div>${c.link?`<div class="project-links"><a class="text-link" ${c.id==='olarion'?external:''} href="${c.id==='olarion'?'https://olarion-zeta.vercel.app/':'#lab'}">${c.link}</a>${c.github?`<a class="quiet-link" href="https://github.com/Dennis-Sosa/Olarion" ${external}>${c.github}</a>`:''}</div>`:''}</div>${visual(c)}</div><details class="case-detail"><summary>${c.detail}<span class="expand-symbol" aria-hidden="true"></span></summary><div class="detail-grid">${c.rows.map(r=>`<div><h4>${r[0]}</h4><p>${r[1]}</p></div>`).join('')}</div></details></article>`).join('')+`<div class="more-header">${t.moreTitle}</div><div class="more-grid">${t.more.map(m=>`<article><p class="eyebrow">${m.k}</p><h3>${m.h}</h3><p>${m.p}</p><div class="small-result"><strong>${m.m}</strong><span>${m.l}</span></div></article>`).join('')}</div>`;
}
function renderLab() {
 const t=copy[language];
 document.getElementById('lab').innerHTML=`<div class="section-head"><div><p class="eyebrow">02 / THE THINKING LAB</p><h2>${t.labTitle}</h2></div><p class="section-aside">${t.labIntro}</p></div><div class="lab-shell"><div class="lab-tabs" role="tablist" aria-label="${language==='zh'?'交互实验':'Interactive experiments'}">${['uplift','audit'].map((key,i)=>`<button id="tab-${key}" role="tab" aria-selected="${key===activeLab}" aria-controls="panel-${key}" tabindex="${key===activeLab?0:-1}" data-lab="${key}">${t.tabs[i]}</button>`).join('')}</div><div id="panel-uplift" class="lab-panel" role="tabpanel" aria-labelledby="tab-uplift" ${activeLab!=='uplift'?'hidden':''}><div class="sim-layout"><div class="sim-controls"><label for="budget">${t.budget}</label><div class="budget-value"><output for="budget" id="budget-output">${budget}</output><span>${t.budgetUnit}</span></div><input id="budget" type="range" min="10" max="60" step="10" value="${budget}"><div class="range-ends"><span>10</span><span>60</span></div><p class="control-label">${t.strategy}</p><div class="strategy-buttons">${['propensity','uplift'].map((key,i)=>`<button data-strategy="${key}" aria-pressed="${strategy===key}">${t.strategies[i]}</button>`).join('')}</div><p id="strategy-note" class="strategy-note"></p><div class="sim-result" aria-live="polite" aria-atomic="true"><span>${t.expected}</span><strong id="increment"></strong><small>${t.baseline}</small><div><span>${t.cost}</span><b id="cost"></b></div></div></div><div class="sim-field"><div class="sim-field-top"><span>80 PEOPLE. ONE DECISION.</span><span>${language==='zh'?'合成数据':'SYNTHETIC DATA'}</span></div><div class="people-groups">${t.groups.map((name,i)=>`<div class="people-group"><div class="people-group-heading"><h4>${name}</h4><span>${['+3','+30','+1','−10'][i]}pp</span></div><div class="people-dots" id="group-${i}" role="img"></div><div class="group-prob"><span>${t.probs[i]}</span></div></div>`).join('')}</div><p class="sim-legend">${t.legend}</p><p class="prob-label">${t.groupLabel}</p></div></div><p class="sim-takeaway">${t.labTakeaway}</p><details class="math-detail"><summary>${language==='zh'?'这个结果怎么算？':'How is this calculated?'}</summary><p>${t.formula}</p></details><p class="lab-disclaimer">${t.labCaveat}</p></div><div id="panel-audit" class="lab-panel" role="tabpanel" aria-labelledby="tab-audit" ${activeLab!=='audit'?'hidden':''}><div class="audit-intro"><h3>${t.auditTitle}</h3><p>${t.auditIntro}</p></div><div class="audit-options" role="group" aria-label="${language==='zh'?'代码示例':'Code examples'}">${t.auditOptions.map((s,i)=>`<button data-audit="${i}" aria-pressed="${i===auditIndex}">${s}</button>`).join('')}</div><div class="audit-demo-layout"><div class="demo-code"><div class="file-title"><span>example.py</span><span>${language==='zh'?'简化示例':'SIMPLIFIED EXAMPLE'}</span></div><pre id="audit-code"></pre></div><div id="audit-answer" aria-live="polite"></div></div><button id="reveal-audit" class="button primary">${auditRevealed?t.auditReset:t.auditReveal}</button><p class="lab-disclaimer">${t.auditNote} <a href="https://olarion-zeta.vercel.app/" ${external}>Olarion</a></p></div></div>`;
 document.querySelectorAll('[data-lab]').forEach(btn=>{btn.addEventListener('click',()=>switchLab(btn.dataset.lab));btn.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();switchLab(e.key==='Home'?'uplift':e.key==='End'?'audit':activeLab==='uplift'?'audit':'uplift');document.getElementById(`tab-${activeLab}`).focus();}})});
 document.getElementById('budget').addEventListener('input',e=>{budget=Number(e.target.value);updateSimulation();});
 document.querySelectorAll('[data-strategy]').forEach(btn=>btn.addEventListener('click',()=>{strategy=btn.dataset.strategy;updateSimulation();}));
 document.querySelectorAll('[data-audit]').forEach(btn=>btn.addEventListener('click',()=>{auditIndex=Number(btn.dataset.audit);auditRevealed=false;updateAudit();}));
 document.getElementById('reveal-audit').addEventListener('click',()=>{auditRevealed=!auditRevealed;updateAudit();});
 updateSimulation();updateAudit();
}
function switchLab(key){
 activeLab=key;
 document.querySelectorAll('[data-lab]').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.lab===key));b.tabIndex=b.dataset.lab===key?0:-1;});
 document.getElementById('panel-uplift').hidden=key!=='uplift';document.getElementById('panel-audit').hidden=key!=='audit';
}
function updateSimulation(){
 const t=copy[language],deltas=[.03,.30,.01,-.10],order=strategy==='uplift'?[1,0,2,3]:[0,1,3,2];
 let left=budget,increment=0;const counts=[0,0,0,0];
 order.forEach(g=>{counts[g]=Math.min(left,20);left-=counts[g];increment+=counts[g]*deltas[g];});
 document.getElementById('budget-output').textContent=budget;
 document.getElementById('strategy-note').textContent=t.strategyNotes[strategy==='uplift'?1:0];
 document.querySelectorAll('[data-strategy]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.strategy===strategy)));
 document.getElementById('increment').textContent=(increment>0?'+':'')+increment.toFixed(1);
 document.getElementById('cost').textContent=increment>0?(budget/increment).toFixed(1):'—';
 counts.forEach((n,g)=>{const el=document.getElementById(`group-${g}`);el.innerHTML=Array.from({length:20},(_,i)=>`<span class="person-dot ${i<n?'selected':''} ${g===3?'negative':''}" aria-hidden="true"></span>`).join('');el.setAttribute('aria-label',language==='zh'?`${t.groups[g]}：20 人中 ${n} 人收到券`:`${t.groups[g]}: ${n} of 20 receive a coupon`);});
}
function updateAudit(){
 const t=copy[language],a=audits[auditIndex],result=a[language];
 document.querySelectorAll('[data-audit]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.audit)===auditIndex)));
 document.getElementById('audit-code').innerHTML=a.lines.map((line,i)=>`<span class="code-line ${auditRevealed&&i===a.highlight?'highlight':''}"><i>${String(i+1).padStart(2,'0')}</i>${escapeHTML(line)}</span>`).join('');
 document.getElementById('reveal-audit').textContent=auditRevealed?t.auditReset:t.auditReveal;
 document.getElementById('audit-answer').innerHTML=auditRevealed?`<span class="audit-badge ${auditIndex===2?'clean':''}">${result.badge}</span><h4>${result.title}</h4><p>${result.text}</p>`:`<div class="unrevealed"><span>?</span><p>${language==='zh'?'先想一想：预测发生的那一刻，<br>哪些信息真的可用？':'At the moment of prediction,<br>what information is actually available?'}</p></div>`;
}
function renderAbout(){
 const t=copy[language];
 document.getElementById('about').innerHTML=`
 <div class="about-grid">
   <div class="about-person">
     <p class="eyebrow">03 / THE PERSON BEHIND THE WORK</p>
     <h2>${t.aboutTitle}</h2>
     <p class="about-intro">${t.aboutIntro}</p>
     <div class="about-identity">${t.identity.map(s=>`<span>${s}</span>`).join('')}</div>
   </div>
   <aside class="photography-card" aria-labelledby="photography-title">
     <div class="photo-kicker"><span>PHOTOGRAPHY</span><span>${t.photoLabel}</span></div>
     <div class="photo-viewfinder">
       <h3 id="photography-title">${t.photoTitle}</h3>
       <p>${t.photoText}</p>
     </div>
     <p class="photo-footer">${t.photoFooter}</p>
   </aside>
 </div>
 <div class="principles about-principles">${t.principles.map((p,i)=>`<div><span>0${i+1}</span><div><h3>${p[0]}</h3><p>${p[1]}</p></div></div>`).join('')}</div>
 <div class="toolbox"><span>${t.skillsTitle}</span><div>${t.skills.map(s=>`<span>${s}</span>`).join('')}</div></div>
 <div class="contact-block"><div class="contact-identity"><img src="assets/avatar.jpg" width="48" height="48" alt="${t.avatar}" loading="lazy"><span>DENNIS WANG<br><small>王宇同</small></span></div><h2>${t.contactTitle}</h2><p>${t.contactText}</p><div class="contact-links"><a class="button primary" href="mailto:yw2799@cornell.edu">${t.email}</a><a class="text-link" href="https://www.linkedin.com/in/yutong-w-6043b4380/" ${external}>LinkedIn</a><a class="text-link" href="https://github.com/Dennis-Sosa" ${external}>GitHub</a></div><a class="email-address" href="mailto:yw2799@cornell.edu">yw2799@cornell.edu</a></div>
 <p class="source-note">${t.source}</p>`;
}
function render(){renderCases();renderLab();renderAbout();}
document.getElementById('language').addEventListener('click',()=>{
 const openCases=[...document.querySelectorAll('.project:has(details[open])')].map(el=>el.classList[1]);
 language=language==='zh'?'en':'zh';
 document.documentElement.lang=language==='zh'?'zh-CN':'en';
 document.querySelectorAll('[data-zh][data-en]').forEach(el=>el.innerHTML=el.dataset[language]);
 document.getElementById('language').innerHTML=language==='zh'?'EN <span aria-hidden="true">/ 中</span>':'中 <span aria-hidden="true">/ EN</span>';
 document.getElementById('language').setAttribute('aria-label',language==='zh'?'Switch to English':'切换为中文');
 document.title=language==='zh'?'王宇同 Dennis Wang · 从问题到产品':'Dennis Wang · From questions to products';
 render();openCases.forEach(cls=>{const detail=document.querySelector(`.${cls} details`);if(detail)detail.open=true;});
});
render();
