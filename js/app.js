
const D={}; const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
async function load(){
 for(const n of ["site","entities","facts","relations","spots","dialogue","language","actions","quiz","sources","media"])
   D[n]=await fetch(`data/${n}.json`).then(r=>r.json());
 $("#title").textContent=D.site.name; renderOverview(); renderSpots(); renderQuiz(); setupChat();
}
const fact=id=>D.facts.facts.find(x=>x.id===id);
const entity=id=>D.entities.entities.find(x=>x.id===id);
const srcLabel=f=>{const s=f.source_refs?.[0];return s?`出典：報告書 p.${s.page_label}`:""};
function badge(f){return ({confirmed:"確認",inferred:"推定・解釈",possible:"可能性",not_detected:"未検出",not_confirmed:"断定不可"}[f.assertion_type]||f.assertion_type)}
function renderFacts(ids){return ids.map(id=>{const f=fact(id);return `<div class="card"><div>${esc(f.statement)}</div><div class="meta">${badge(f)} ／ ${srcLabel(f)}</div></div>`}).join("")}
function renderOverview(){
 $("#overviewFacts").innerHTML=renderFacts(D.site.summary_fact_ids);
}
function renderSpots(){
 $("#spots").innerHTML=D.spots.spots.map(s=>`<button class="choice" data-spot="${s.id}">${esc(s.name)}</button>`).join("");
 $("#spots").onclick=e=>{const b=e.target.closest("[data-spot]");if(!b)return;const s=D.spots.spots.find(x=>x.id===b.dataset.spot);$("#spotDetail").innerHTML=`<h3>${esc(s.name)}</h3>${renderFacts(s.description_fact_ids)}`};
}
function setupChat(){
 $("#ask").onclick=()=>ask($("#question").value); $("#question").onkeydown=e=>{if(e.key==="Enter")ask(e.target.value)};
 $("#suggestions").onclick=e=>{const b=e.target.closest("[data-dlg]");if(b)answerDialogue(D.dialogue.dialogues.find(x=>x.id===b.dataset.dlg))};
}
function ask(q){
 q=q.trim(); if(!q)return; addBubble(q,"user"); $("#question").value="";
 const scored=D.dialogue.dialogues.map(d=>({d,n:(d.trigger.keywords||[]).filter(k=>q.includes(k)).length})).sort((a,b)=>b.n-a.n);
 if(!scored[0]||scored[0].n===0){addBubble("この最小版では、その質問に対応する登録済み情報を見つけられませんでした。下の候補から選んでください。","bot");showSuggestions(D.dialogue.dialogues.slice(0,4).map(d=>({label:d.topic,dialogue_id:d.id})));return}
 answerDialogue(scored[0].d);
}
function answerDialogue(d){
 let parts=(d.fact_ids||[]).map(id=>fact(id).statement);
 for(const rid of d.relation_ids||[]){
   const r=D.relations.relations.find(x=>x.id===rid), a=entity(r.subject_id), b=entity(r.object_id);
   if(rid.includes("kawachinoatai")) parts.push(`${a.name}が河内寺廃寺の造営に関わったとする見解があります。`);
   else if(rid.includes("nakatomi")) parts.push(`${a.name}の関与を想定する仮説も示されています。`);
   else parts.push(`${a?.name||r.subject_id}と${b?.name||r.object_id}の関係が論じられています。`);
 }
 addBubble(parts.join(" また、"),"bot"); showSuggestions(d.suggestions||[]);
}
function addBubble(t,c){$("#chatlog").insertAdjacentHTML("beforeend",`<div class="bubble ${c}">${esc(t)}</div>`);$("#chatlog").scrollTop=$("#chatlog").scrollHeight}
function showSuggestions(a){$("#suggestions").innerHTML=a.map(x=>`<button class="chip" data-dlg="${x.dialogue_id}">${esc(x.label)}</button>`).join(" ")}
function renderQuiz(){
 const q=D.quiz.quizzes[0]; $("#quizbox").innerHTML=`<div class="card"><h3>${esc(q.question)}</h3>${q.choices.map(c=>`<button class="choice" data-choice="${c.id}">${esc(c.label)}</button>`).join("")}<div id="quizresult"></div></div>`;
 $("#quizbox").onclick=e=>{const b=e.target.closest("[data-choice]");if(!b)return;const ok=b.dataset.choice===q.correct_choice_id;$("#quizresult").innerHTML=`<p><strong>${ok?"正解です。":"不正解です。"}</strong></p>${renderFacts(q.explanation_fact_ids)}`};
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$$(".navbtn").forEach(b=>b.onclick=()=>{$$(".view").forEach(v=>v.classList.remove("active"));$("#"+b.dataset.view).classList.add("active")});
load().catch(e=>{$("#error").textContent="データ読み込みに失敗しました。GitHub Pages等のHTTPサーバー上で開いてください。 "+e});
