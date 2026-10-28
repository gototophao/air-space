const c=window.AIR_SPACE;
const main=document.querySelector('main');
const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const safeURL=v=>/^(https?:\/\/|assets\/)/i.test(v||'')?esc(v):'';
const photo=(src,alt,label,cls='')=>`<div class="photo-frame ${cls}">${safeURL(src)?`<img src="${safeURL(src)}" alt="${esc(alt)}">`:''}<div class="image-placeholder" ${safeURL(src)?'hidden':''}><span class="placeholder-symbol" aria-hidden="true">＋</span><span>${label}</span></div></div>`;
const link=(url,text)=>safeURL(url)?`<a class="text-link" href="${safeURL(url)}">${text} <span>↗</span></a>`:'';
const heading=(num,kicker,title,intro)=>`<section class="page-heading"><div class="wrap"><p class="eyebrow">${num} / ${kicker}</p><h1>${esc(title)}</h1><p class="lede">${esc(intro)}</p></div><span class="heading-orbit" aria-hidden="true"></span></section>`;
const subjects=[['01','Air in everyday places','Connecting measurements of indoor and outdoor air, from homes to urban environments.'],['02','Different ways of knowing','Bringing air quality science into conversation with social, health and heritage perspectives.'],['03','Communities & inequalities','Exploring unequal exposure to poor air and supporting community approaches to air quality.']];
const newsCard=n=>`<article class="news-card">${photo(n.image,n.title,'News photograph')}<div class="news-card-copy"><p class="eyebrow">${esc(n.category||'Project update')}${n.date?` / <time datetime="${esc(n.date)}">${esc(n.date)}</time>`:''}</p><h3>${esc(n.title)}</h3><p>${esc(n.summary)}</p>${link(n.url,'Read story')}</div></article>`;
const empty=(title,text)=>`<div class="empty-state"><span class="empty-mark" aria-hidden="true">↗</span><div><h2>${title}</h2><p>${text}</p></div></div>`;
const memberId=(p,index)=>p.id||String(p.image||'').split('/').pop().replace(/\.[^.]+$/,'')||'member-'+(index+1);
const profileHref=p=>'#people/'+encodeURIComponent(memberId(p,c.people.indexOf(p)));
const paragraphText=t=>String(t||'').split(/\n\s*\n/).filter(t=>t.trim()).map(t=>`<p>${esc(t).replace(/\n/g,'<br>')}</p>`).join('');
function renderProfile(id){
 const person=c.people.find((p,i)=>memberId(p,i)===id);
 const demo=/^template-(leadership|researcher)-[123]$/.test(id);
 if(!person&&!demo){document.title=`Profile unavailable | ${c.name}`;return `<section class="wrap content-section">${empty('Profile unavailable','This profile may have moved or is not published yet.')}<a class="text-link profile-back" href="#people">← Back to our people</a></section>`;}
 const p=person||{name:'Profile coming soon',role:'Role to be added',affiliation:'Institution to be added',bio:'This space is reserved for a member of the Air Space team.',group:id.includes('leadership')?'Leadership Team':'Researchers'};
 const topics=String(p.interests||'').split(/[;；\n]+/).map(t=>t.trim()).filter(Boolean);
 document.title=`${p.name} | ${c.name}`;
 return `<article class="profile-page"><div class="wrap"><a class="profile-back" href="#people">← Back to our people</a><div class="profile-layout"><div class="profile-copy"><p class="eyebrow">${esc(p.group||'Researchers')} / ${esc(c.name)}</p><h1>${esc(p.name)}</h1>${p.role?`<p class="profile-role">${esc(p.role)}</p>`:''}${p.affiliation?`<p class="profile-affiliation">${esc(p.affiliation)}</p>`:''}<div class="profile-biography"><h2>About</h2>${p.bio?`<p class="profile-lead">${esc(p.bio)}</p>`:''}${p.biography?paragraphText(p.biography):!p.bio?'<p>A biography will be shared here soon.</p>':''}${demo?'<p>The full biography will appear here once the team profile is ready.</p>':''}</div>${topics.length?`<section class="profile-interests"><h2>Research interests</h2><ul>${topics.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></section>`:''}</div><aside class="profile-aside" aria-label="Portrait and contact links">${photo(p.image,p.name,'Portrait coming soon','profile-portrait')}<div class="profile-contact"><h2>Connect</h2>${p.email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)?`<a href="mailto:${esc(p.email)}"><span>Email</span><span aria-hidden="true">↗</span></a>`:''}${safeURL(p.url)?`<a href="${safeURL(p.url)}"><span>Institutional profile</span><span aria-hidden="true">↗</span></a>`:''}${safeURL(p.linkedin)?`<a href="${safeURL(p.linkedin)}"><span>LinkedIn</span><span aria-hidden="true">↗</span></a>`:''}${!p.email&&!safeURL(p.url)&&!safeURL(p.linkedin)?'<p>Contact information will be added soon.</p>':''}</div></aside></div><div class="profile-bottom"><span>${esc(c.name)} / Our people</span><a class="text-link" href="#people">Explore the team <span>↗</span></a></div></div></article>`;
}
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=motionPreference.matches;
let heroMotion=null;
function renderHome(){
 const scenes=[
  ['work','sceneWorkplace','At work','assets/places/workplace.png'],
  ['home','sceneHomes','At home','assets/places/homes.png'],
  ['transport','sceneTransport','On public transport','assets/places/public-transport.png'],
  ['commute','sceneCommute','On the move','assets/places/commuting.png']
 ];
 const scene=s=>`<figure class="place-tile place-${s[0]}">${photo(c[s[1]+'Image']||s[3],c[s[1]+'Alt']||s[2],s[2],'place-image')}<figcaption>${esc(c[s[1]+'Title']||s[2])}</figcaption></figure>`;
 return `<div class="home-editorial">
 <section class="life-hero cinematic-hero ${motionPaused?'motion-paused':''}">
  <div class="cinema-media" aria-hidden="true"><img class="cinema-image" src="${safeURL(c.heroImage)||'assets/project/shared-air-interior.png'}" alt="" fetchpriority="high" decoding="async"><div class="cinema-light"></div><canvas class="cinema-particles"></canvas></div>
  <div class="cinema-shade" aria-hidden="true"></div>
  <div class="wrap cinema-content"><p class="eyebrow"><span class="project-dot" aria-hidden="true"></span>${esc(c.projectTitle||c.name)}</p><h1>${c.tagline==='Understanding the air we share.'?'Understanding<br>the air we share.':esc(c.tagline)}</h1><p class="cinema-intro">${esc(c.introduction)}</p><div class="hero-action-row"><a class="button cinema-button" href="#mission">Explore Air Space <span aria-hidden="true">↗</span></a><a class="cinema-team" href="#people">Meet the team <span aria-hidden="true">→</span></a></div></div>
  <div class="wrap cinema-bottom"><p class="cinema-location">Greater Manchester, UK <span aria-hidden="true">/</span> Indoors & outdoors</p><div class="cinema-controls"><span class="cinema-credit">Conceptual image</span><button class="motion-toggle" type="button" aria-pressed="${!motionPaused}" aria-label="${motionPaused?'Play background animation':'Pause background animation'}"><span class="motion-icon" aria-hidden="true">${motionPaused?'▷':'Ⅱ'}</span><span class="motion-label">${motionPaused?'Play animation':'Pause animation'}</span></button></div></div>
 </section>
 <section class="everyday-section"><div class="wrap"><div class="everyday-heading"><p class="eyebrow">${esc(c.placesEyebrow||'Air in everyday life')}</p><h2>Where life happens,<br>air matters.</h2><p>${esc(c.placesNote||'Everyday settings, shown for context.')}</p></div><div class="places-mosaic">${scenes.map(scene).join('')}</div></div></section>
 <section id="mission" class="project-story wrap"><div class="story-heading"><p class="eyebrow">01 / The project</p><h2>${esc(c.aboutTitle)}</h2><a class="text-link" href="#people">Meet the people <span>↗</span></a></div><div class="story-copy"><p class="story-lead">${esc(c.about)}</p><p>${esc(c.aboutDetail)}</p></div>${c.aboutImage?photo(c.aboutImage,c.aboutImageAlt||'Air Space project','Project photograph','story-photo'):''}</section>
 <section class="research-editorial"><div class="wrap"><div class="research-header"><p class="eyebrow">02 / Our approach</p><h2>More than one way<br>to understand air.</h2></div><div class="research-columns">${subjects.map(s=>`<article><span class="research-number">${s[0]}</span><h3>${s[1]}</h3><p>${s[2]}</p></article>`).join('')}</div></div></section>
 <section class="equipment-section" aria-labelledby="equipment-heading"><div class="wrap"><div class="equipment-intro"><div><p class="eyebrow">03 / Making air visible</p><h2 id="equipment-heading">${esc(c.equipmentTitle||'Air quality measurements')}</h2></div><p>${esc(c.equipmentIntro||'From everyday settings to laboratory analysis, measurements help us ask new questions about air.')}</p></div><div class="equipment-grid"><figure>${photo(c.equipmentSensorImage,c.equipmentSensorAlt||'Air quality monitor','Equipment photograph','equipment-image')}<figcaption><span class="equipment-category">In everyday spaces</span><h3>${esc(c.equipmentSensorTitle||'Monitoring in everyday spaces')}</h3><p>${esc(c.equipmentSensorText)}</p></figcaption></figure><figure>${photo(c.equipmentLabImage,c.equipmentLabAlt||'Laboratory analytical instrument','Equipment photograph','equipment-image')}<figcaption><span class="equipment-category">In the laboratory</span><h3>${esc(c.equipmentLabTitle||'Inside the laboratory')}</h3><p>${esc(c.equipmentLabText)}</p></figcaption></figure></div></div></section>
 <section class="editorial-news"><div class="wrap"><div class="section-top"><div><p class="eyebrow">04 / From Air Space</p><h2>Notes from the project.</h2></div><a class="text-link" href="#news">All news <span>↗</span></a></div>${c.news.length?`<div class="news-grid">${c.news.slice(0,3).map(newsCard).join('')}</div>`:`<div class="news-waiting"><span class="news-waiting-arrow" aria-hidden="true">↗</span><div><h3>Our story is just beginning.</h3><p>Research updates, events and conversations will be shared here.</p></div><span class="news-waiting-label">Updates to come</span></div>`}</div></section>
 <section class="editorial-invitation"><div class="wrap"><div><p class="eyebrow">A shared atmosphere. An open conversation.</p><h2>Let’s think about air,<br>together.</h2></div><a class="button" href="#collaborate">Collaborate with us <span>↗</span></a></div></section></div>`;
}

function render(){
 if(heroMotion){heroMotion.destroy();heroMotion=null;}
 const hash=location.hash.slice(1);
 const page=hash.startsWith('people/')?'people':['home','people','news','collaborate'].includes(hash)?hash:'home';
 let profileId='';if(hash.startsWith('people/')){try{profileId=decodeURIComponent(hash.slice(7));}catch{profileId='invalid';}}
 document.title=`${c.name} | ${{home:'Home',people:'People',news:'News',collaborate:'Collaborate with us'}[page]}`;
 document.querySelectorAll('nav a').forEach(a=>{if(a.hash==='#'+page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(page==='home')main.innerHTML=renderHome();
 if(page==='people'){
  const member=p=>`<article class="team-person"><a class="team-profile-link" href="${esc(profileHref(p))}" aria-label="View profile: ${esc(p.name)}">${photo(p.image,p.name,'Portrait coming soon','team-portrait')}<span class="portrait-open" aria-hidden="true">↗</span></a><h3><a href="${esc(profileHref(p))}">${esc(p.name)}</a></h3>${p.role?`<p class="team-role">${esc(p.role)}</p>`:''}${p.affiliation?`<p class="team-affiliation">${esc(p.affiliation)}</p>`:''}${p.bio?`<p class="team-bio">${esc(p.bio)}</p>`:''}<a class="team-read-more" href="${esc(profileHref(p))}">View biography <span aria-hidden="true">↗</span></a></article>`;
  const group=(name,index)=>{
   const members=c.people.filter(p=>(p.group||'Researchers')===name);
   return `<section class="team-group ${index?'team-group-tint':''}" aria-labelledby="team-group-${index}"><div class="wrap"><h2 id="team-group-${index}">${esc(index===0?(c.peopleLeadershipTitle||name):(c.peopleResearchersTitle||name))}</h2><div class="team-grid">${members.length?members.map(member).join(''):Array.from({length:3},(_,i)=>`<article class="team-person team-pending"><a class="team-profile-link" href="#people/template-${index?'researcher':'leadership'}-${i+1}" aria-label="Preview ${esc(name)} biography template ${i+1}">${photo('','','Portrait coming soon','team-portrait')}<span class="portrait-open" aria-hidden="true">↗</span></a><h3><a href="#people/template-${index?'researcher':'leadership'}-${i+1}">Profile coming soon</a></h3><p>Team details to be added</p></article>`).join('')}</div></div></section>`;
  };
  main.innerHTML=`<div class="people-page"><section class="team-intro wrap"><h1>${esc(c.peopleTitle||'Meet the Team')}</h1><div class="team-intro-grid ${c.peopleImage?'':'without-photo'}"><div><p class="team-intro-lead">${esc(c.peopleIntro)}</p><p>${esc(c.peopleDescription||'Air Space brings together social, health and atmospheric sciences with heritage studies, combining air quality measurements with qualitative and creative approaches. Our team explores how communities and different disciplines understand, experience and measure the air we share.')}</p></div>${c.peopleImage?photo(c.peopleImage,c.peopleImageAlt||'Air Space team','Team photograph coming soon','team-photo'):''}</div></section>${group('Leadership Team',0)}${group('Researchers',1)}</div>`;
 }
 if(profileId)main.innerHTML=renderProfile(profileId);
 if(page==='news')main.innerHTML=`${heading('02','News','News, stories & conversations.',c.newsIntro)}<section class="wrap content-section">${c.news.length?`<div class="news-grid">${c.news.map(newsCard).join('')}</div>`:empty('More to come.','Our project updates and announcements will appear here.')}</section>`;
 if(page==='collaborate')main.innerHTML=`${heading('03','Collaborate with us',c.collaborateTitle,c.collaborateText)}<section class="wrap content-section"><div class="contact-panel"><div><p class="eyebrow">Start a conversation</p><h2>Let’s connect.</h2><p>${c.email?'Tell us about your interests and ideas.':'Ways to get involved and contact details will be shared here soon.'}</p></div>${/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)?`<a class="button" href="mailto:${esc(c.email)}">${esc(c.email)} <span>↗</span></a>`:'<span class="contact-soon">Contact details coming soon</span>'}</div><div class="partners"><p class="eyebrow">Working together</p><h2>Partners & collaborators</h2>${c.partners.length?`<div class="partner-grid">${c.partners.map(p=>`<article>${photo(p.logo,p.name,'Partner logo')}<h3>${esc(p.name)}</h3>${link(p.url,'Visit website')}</article>`).join('')}</div>`:'<p class="partner-empty">Partner information will be added here.</p>'}</div></section>`;
 document.querySelector('nav').classList.remove('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');
 if(main.querySelector('.cinematic-hero'))heroMotion=window.createAirSpaceAtmosphere(main.querySelector('.cinematic-hero'));
 const motionButton=main.querySelector('.motion-toggle');
 if(motionButton)motionButton.addEventListener('click',()=>{
  motionPaused=!motionPaused;main.querySelector('.life-hero').classList.toggle('motion-paused',motionPaused);heroMotion?.setPaused(motionPaused);
  motionButton.setAttribute('aria-pressed',String(!motionPaused));motionButton.setAttribute('aria-label',motionPaused?'Play background animation':'Pause background animation');
  motionButton.querySelector('.motion-icon').textContent=motionPaused?'▷':'Ⅱ';motionButton.querySelector('.motion-label').textContent=motionPaused?'Play animation':'Pause animation';
 });
 main.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{
  if(img.parentElement.classList.contains('team-photo')){img.parentElement.hidden=true;main.querySelector('.team-intro-grid').classList.add('without-photo');return;}
  img.hidden=true;if(img.nextElementSibling?.classList.contains('image-placeholder'))img.nextElementSibling.hidden=false;
 },{once:true}));
}
motionPreference.addEventListener('change',()=>{
 motionPaused=motionPreference.matches;
 const hero=main.querySelector('.cinematic-hero');if(!hero)return;
 hero.classList.toggle('motion-paused',motionPaused);heroMotion?.setPaused(motionPaused);
 const button=hero.querySelector('.motion-toggle');
 button.setAttribute('aria-pressed',String(!motionPaused));button.setAttribute('aria-label',motionPaused?'Play background animation':'Pause background animation');
 button.querySelector('.motion-icon').textContent=motionPaused?'▷':'Ⅱ';button.querySelector('.motion-label').textContent=motionPaused?'Play animation':'Pause animation';
});
document.querySelector('#brand-name').textContent=c.name;
if(safeURL(c.logo))document.querySelector('#brand-icon').innerHTML=`<img src="${safeURL(c.logo)}?v=20261028-logo2" alt="">`;
document.querySelector('.footer-brand').firstChild.textContent=c.name;
document.querySelector('#affiliation').textContent=c.affiliation;
document.querySelector('#copyright-name').textContent=c.name;
document.querySelector('#year').textContent=new Date().getFullYear();
document.querySelector('.menu-toggle').addEventListener('click',e=>{const open=document.querySelector('nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open));});
window.addEventListener('hashchange',()=>{if(location.hash==='#mission')return;if(location.hash==='#main'){main.focus();return;}render();window.scrollTo(0,0);main.focus({preventScroll:true});});render();
