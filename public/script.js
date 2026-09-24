const STORAGE = 'soumias-portfolio-content';
// Credentials must be verified on the server in production. Never publish a real password in this file.
const defaults = { photo: '', resumes: {}, projects: [{ title: 'Proyecto destacado', url: '' }, { title: 'Proyecto destacado', url: '' }, { title: 'Proyecto destacado', url: '' }] };
const resumeCopy = { es: ['Currículum en español|Perfil profesional para oportunidades en España|Ver CV', 'Currículum en inglés|Perfil profesional para oportunidades internacionales|Ver CV', 'Currículum en francés|Perfil profesional para oportunidades francófonas|Ver CV', 'Currículum en árabe|Perfil profesional para oportunidades árabes|Ver CV'], en: ['Résumé in Spanish|Professional profile for opportunities in Spain|View CV', 'Résumé in English|Professional profile for international roles|View CV', 'Résumé in French|Professional profile for French-speaking roles|View CV', 'Résumé in Arabic|Professional profile for Arabic-speaking roles|View CV'], fr: ['Curriculum en espagnol|Profil professionnel pour les opportunités en Espagne|Voir le CV', 'Curriculum en anglais|Profil professionnel pour les postes internationaux|Voir le CV', 'Curriculum en français|Profil professionnel pour les postes francophones|Voir le CV', 'Curriculum en arabe|Profil professionnel pour les postes arabophones|Voir le CV'] };
let content = JSON.parse(localStorage.getItem(STORAGE) || 'null') || defaults;
content.technologies ||= [
  { name: 'Frontend', description: 'HTML · CSS · JavaScript · TypeScript · Angular', image: '' },
  { name: 'Backend', description: 'Java · PHP · Spring Boot · APIs REST', image: '' },
  { name: 'Datos', description: 'MySQL Server · Workbench · Bases de datos relacionales', image: '' },
  { name: 'Entrega', description: 'Git · Control de versiones · Despliegue web', image: '' }
];
content.projects = content.projects.map((project) => ({ ...project, description: project.description || '', image: project.image || '' }));
content.resumes ||= {};
Object.values(content.resumes).forEach((resume) => { resume.image ||= ''; });
content.contact ||= { email: 'soumia.abdelaati.lamrahi@gmail.com', linkedin: 'https://www.linkedin.com/in/soumia-abdelaati-lamrahi-/', phone: '', whatsapp: '' };
content.profile ||= { title: '', introduction: '', name: 'Soumia Abdelaati Lamrahi', role: 'Desarrolladora Web' };
content.profile.name ||= 'Soumia Abdelaati Lamrahi'; content.profile.role ||= 'Desarrolladora Web';
const get = (id) => document.getElementById(id);
const persist = () => fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) }).then((response) => { if (!response.ok) throw new Error('No se pudo guardar'); return true; }).catch(() => { const note = get('saveNote'); if (note) note.textContent = 'No se pudo guardar en el servidor local. Comprueba que has iniciado npm run dev.'; return false; });
function render() {
  const photo = get('profilePhoto'); photo.src = content.photo || '/foto.jpg'; photo.style.display = content.photo ? 'block' : '';
  renderTechnologies();
  renderResumes(localStorage.getItem('soumias-portfolio-language') || 'es');
  document.querySelectorAll('[data-project]').forEach((link) => { const project = content.projects[Number(link.dataset.project)]; const card = link.closest('.project-card'); link.href = project.url || '#'; card.querySelector('h3').textContent = project.title || 'Proyecto destacado'; const visual = card.querySelector('.project-visual'); visual.style.backgroundImage = project.image ? `linear-gradient(rgba(6,53,85,.2),rgba(6,53,85,.2)),url(${project.image})` : ''; visual.style.backgroundSize = 'cover'; visual.style.backgroundPosition = 'center'; let description = card.querySelector('.project-description'); if (!description) { description = document.createElement('p'); description.className = 'project-description'; link.before(description); } description.textContent = project.description || ''; });
  renderContact();
  applyCustomProfile();
}

function applyCustomProfile() {
  let name = get('profileName');
  if (!name) { name = document.createElement('p'); name.id = 'profileName'; name.className = 'profile-name'; document.querySelector('.hero h1').before(name); }
  name.textContent = content.profile.name || 'Soumia Abdelaati Lamrahi';
  if (content.profile.title) document.querySelector('.hero h1').textContent = content.profile.title;
  if (content.profile.introduction) document.querySelector('.intro').textContent = content.profile.introduction;
}

const toolLogos = {
  HTML: 'html5', CSS: 'css3', JavaScript: 'javascript', TypeScript: 'typescript', Angular: 'angular',
  Java: 'openjdk', PHP: 'php', 'Spring Boot': 'springboot', 'APIs REST': 'postman',
  'MySQL Server': 'mysql', Workbench: 'mysql', 'Bases de datos relacionales': 'databricks',
  Git: 'git', 'Control de versiones': 'git', 'Despliegue web': 'cloudflare'
};
function renderTechnologies() {
  const grid = document.querySelector('.tech-grid');
  grid.className = 'tech-groups';
  grid.innerHTML = content.technologies.map((category) => {
    const tools = category.description.split('·').map((tool) => tool.trim()).filter(Boolean);
    return `<article class="tech-category"><h3>${category.name}</h3><div class="tech-tools">${tools.map((tool) => `<div class="tech-tool"><img src="https://cdn.simpleicons.org/${toolLogos[tool] || 'code'}/073B5A" alt="Logo de ${tool}"><span>${tool}</span></div>`).join('')}</div></article>`;
  }).join('');
}

function renderResumes(language) {
  const list = get('resumeList');
  const labels = resumeCopy[language] || resumeCopy.es;
  list.className = 'resume-project-grid';
  list.innerHTML = ['es', 'en', 'fr', 'ar'].map((code, index) => {
    const resume = content.resumes[code] || {};
    const [title, defaultDescription, action] = labels[index].split('|');
    const cover = resume.image ? `style="background-image:linear-gradient(rgba(6,53,85,.18),rgba(6,53,85,.18)),url('${resume.image}')"` : '';
    return `<article class="project-card resume-card"><p class="project-number">${code.toUpperCase()}</p><div class="project-visual resume-visual" ${cover}><span>${code.toUpperCase()}</span></div><div class="project-info"><p class="project-type">Currículum</p><h3>${title}</h3><p class="project-description">${resume.description || defaultDescription}</p><button class="resume-view" type="button" data-open-resume="${code}" ${resume.data ? '' : 'disabled'}>${resume.data ? action : 'Próximamente'} <span>↗</span></button></div></article>`;
  }).join('');
  list.querySelectorAll('[data-open-resume]').forEach((button) => button.addEventListener('click', () => openResume(button.dataset.openResume)));
}
async function openResume(language) {
  const resume = content.resumes[language];
  if (!resume?.data) return;
  const base64 = resume.data.split(',')[1];
  const bytes = Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
  get('resumeViewer').showModal();
  const pages = get('resumeViewerPages'); pages.innerHTML = '<p class="viewer-loading">Cargando currículum…</p>';
  try {
    const pdfjs = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs');
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
    const documentPdf = await pdfjs.getDocument({ data: bytes }).promise;
    pages.innerHTML = '';
    for (let pageNumber = 1; pageNumber <= documentPdf.numPages; pageNumber += 1) {
      const page = await documentPdf.getPage(pageNumber); const viewport = page.getViewport({ scale: 1.45 });
      const canvas = document.createElement('canvas'); canvas.width = viewport.width; canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise; pages.append(canvas);
    }
  } catch { pages.innerHTML = '<p class="viewer-loading">No se ha podido mostrar el PDF. Comprueba tu conexión e inténtalo de nuevo.</p>'; }
}
function renderContact() {
  const contactBox = get('contactBar');
  const entries = [
    ['Email', content.contact.email, content.contact.email ? `mailto:${content.contact.email}` : ''],
    ['LinkedIn', content.contact.linkedin, content.contact.linkedin],
    ['Teléfono', content.contact.phone, content.contact.phone ? `tel:${content.contact.phone.replace(/\s/g, '')}` : ''],
    ['WhatsApp', content.contact.whatsapp, content.contact.whatsapp ? `https://wa.me/${content.contact.whatsapp.replace(/\D/g, '')}` : '']
  ].filter(([, value]) => value);
  contactBox.innerHTML = entries.map(([label, value, href]) => `<span class="contact-detail"><b>${label}</b> <a href="${href}" ${label === 'LinkedIn' || label === 'WhatsApp' ? 'target="_blank" rel="noopener"' : ''}>${value}</a><button type="button" data-copy="${value}">Copiar</button></span>`).join('<span class="contact-separator" aria-hidden="true">|</span>');
  contactBox.querySelectorAll('[data-copy]').forEach((button) => button.addEventListener('click', async () => { await navigator.clipboard.writeText(button.dataset.copy); const previous = button.textContent; button.textContent = 'Copiado'; setTimeout(() => { button.textContent = previous; }, 1500); }));
}
get('profilePhoto').addEventListener('error', () => { get('profilePhoto').style.display = 'none'; });
const contactBar = document.createElement('aside');
contactBar.id = 'contactBar'; contactBar.className = 'contact-bar'; contactBar.setAttribute('aria-label', 'Datos de contacto');
document.querySelector('.hero').insertAdjacentElement('afterend', contactBar);
document.querySelector('.header-contact')?.remove();
document.querySelector('footer div')?.remove();
const heroContactButton = document.querySelector('.hero .button-primary');
heroContactButton.removeAttribute('href'); heroContactButton.setAttribute('aria-expanded', 'false');
heroContactButton.addEventListener('click', () => { const open = contactBar.classList.toggle('is-open'); heroContactButton.setAttribute('aria-expanded', String(open)); });
get('year').textContent = new Date().getFullYear(); render();
const dialog = get('adminDialog');
get('adminTrigger').addEventListener('click', () => dialog.showModal());
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => dialog.close()));
get('loginForm').addEventListener('submit', async (event) => { event.preventDefault(); const error = get('loginError'); error.textContent = ''; const response = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: get('adminEmail').value.trim(), password: get('adminPassword').value }) }); if (!response.ok) { error.textContent = response.status === 503 ? 'El acceso seguro aún no está configurado en el servidor.' : 'Correo o contraseña incorrectos.'; return; } get('adminLogin').hidden = true; get('adminEditor').hidden = false; content.projects.forEach((project, i) => { document.querySelector(`[data-project-title="${i}"]`).value = project.title || ''; document.querySelector(`[data-project-url="${i}"]`).value = project.url || ''; }); populateExtendedEditor(); });
get('logoutButton').addEventListener('click', () => { get('adminLogin').hidden = false; get('adminEditor').hidden = true; get('loginForm').reset(); });
get('photoInput').addEventListener('change', (event) => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { content.photo = reader.result; get('selectedPhoto').textContent = file.name; }; reader.readAsDataURL(file); });
document.querySelectorAll('[data-resume]').forEach((input) => input.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { content.resumes[input.dataset.resume] = { ...(content.resumes[input.dataset.resume] || {}), name: file.name, data: reader.result }; updateAdminPreviews(); };
  reader.readAsDataURL(file);
}));
get('editorForm').addEventListener('submit', (event) => { event.preventDefault(); content.projects = content.projects.map((project, i) => ({ ...project, title: document.querySelector(`[data-project-title="${i}"]`).value.trim() || 'Proyecto destacado', url: document.querySelector(`[data-project-url="${i}"]`).value.trim() })); });

const translations = {
  es: { nav:['Tecnologías','Currículum','Proyectos'], contact:'Contactar', heroTag:'Disponible para oportunidades · España', hero:'Construyo experiencias web <em>claras</em> y funcionales.', intro:'Soy <strong>Soumia Abdelaati Lamrahi</strong>, recién graduada en Desarrollo de Aplicaciones Web. Me gusta convertir ideas en productos digitales cuidados, accesibles y útiles.', projects:'Ver proyectos', toolbox:'01 — Mi caja de herramientas', techTitle:'Tecnologías con las que doy vida a la web.', career:'02 — Trayectoria', cvTitle:'Mi perfil,<br>en tu idioma.', cvText:'Elige la versión que mejor se adapte a tu proceso de selección.', work:'03 — Trabajo seleccionado', workTitle:'Proyectos que hablan por mí.', all:'Ver todo en GitHub', tech:['Frontend|HTML · CSS · JavaScript · TypeScript · Angular','Backend|Java · PHP · Spring Boot · APIs REST','Datos|MySQL Server · Workbench · Bases de datos relacionales','Entrega|Git · Control de versiones · Despliegue web'], cvs:['Currículum en español|Perfil profesional para oportunidades en España|Ver CV','Currículum in English|Professional profile for international roles|View CV','Curriculum en français|Profil professionnel pour les postes francophones|Voir le CV','السيرة الذاتية بالعربية|ملف مهني للفرص الناطقة بالعربية|عرض السيرة'], types:['Frontend','Full stack','Diseño web'], repo:'Ver repositorio' },
  en: { nav:['Technologies','Résumé','Projects'], contact:'Contact', heroTag:'Available for opportunities · Spain', hero:'I build web experiences that are <em>clear</em> and functional.', intro:'I am <strong>Soumia Abdelaati Lamrahi</strong>, a recent Web Application Development graduate. I enjoy turning ideas into thoughtful, accessible and useful digital products.', projects:'View projects', toolbox:'01 — My toolkit', techTitle:'Technologies I use to bring the web to life.', career:'02 — Career', cvTitle:'My profile,<br>in your language.', cvText:'Choose the version that best suits your recruitment process.', work:'03 — Selected work', workTitle:'Projects that speak for me.', all:'See all on GitHub', tech:['Frontend|HTML · CSS · JavaScript · TypeScript · Angular','Backend|Java · PHP · Spring Boot · REST APIs','Data|MySQL Server · Workbench · Relational databases','Delivery|Git · Version control · Web deployment'], cvs:['Résumé in Spanish|Professional profile for opportunities in Spain|View CV','Résumé in English|Professional profile for international roles|View CV','Résumé in French|Professional profile for French-speaking roles|View CV','Résumé in Arabic|Professional profile for Arabic-speaking roles|View CV'], types:['Frontend','Full stack','Web design'], repo:'View repository' },
  fr: { nav:['Technologies','Curriculum','Projets'], contact:'Contacter', heroTag:'Disponible pour des opportunités · Espagne', hero:'Je crée des expériences web <em>claires</em> et fonctionnelles.', intro:'Je suis <strong>Soumia Abdelaati Lamrahi</strong>, récemment diplômée en Développement d’Applications Web. J’aime transformer des idées en produits numériques soignés, accessibles et utiles.', projects:'Voir les projets', toolbox:'01 — Mes outils', techTitle:'Les technologies avec lesquelles je donne vie au web.', career:'02 — Parcours', cvTitle:'Mon profil,<br>dans votre langue.', cvText:'Choisissez la version la plus adaptée à votre processus de recrutement.', work:'03 — Travail sélectionné', workTitle:'Des projets qui parlent pour moi.', all:'Tout voir sur GitHub', tech:['Frontend|HTML · CSS · JavaScript · TypeScript · Angular','Backend|Java · PHP · Spring Boot · APIs REST','Données|MySQL Server · Workbench · Bases de données relationnelles','Livraison|Git · Contrôle de version · Déploiement web'], cvs:['Curriculum en espagnol|Profil professionnel pour les opportunités en Espagne|Voir le CV','Curriculum en anglais|Profil professionnel pour les postes internationaux|Voir le CV','Curriculum en français|Profil professionnel pour les postes francophones|Voir le CV','Curriculum en arabe|Profil professionnel pour les postes arabophones|Voir le CV'], types:['Frontend','Full stack','Design web'], repo:'Voir le dépôt' }
};
function setLanguage(language) {
  const t = translations[language]; if (!t) return;
  document.documentElement.lang = language;
  document.querySelectorAll('nav a').forEach((item, i) => item.textContent = t.nav[i]);
  const headerContact = document.querySelector('.header-contact'); if (headerContact) headerContact.childNodes[0].textContent = `${t.contact} `;
  document.querySelector('.hero .eyebrow').textContent = language === 'es' ? 'Disponible para oportunidades · En remoto, España, Málaga' : t.heroTag;
  document.querySelector('.portrait-caption').textContent = content.profile.role || (language === 'fr' ? 'Développement d’applications web' : language === 'en' ? 'Web Application Development' : 'Desarrollo de Aplicaciones Web');
  document.querySelector('.hero h1').innerHTML = t.hero;
  document.querySelector('.intro').innerHTML = t.intro;
  document.querySelector('.hero .button-primary').childNodes[0].textContent = `${t.contact} `;
  const headings = document.querySelectorAll('.section-heading');
  headings[0].querySelector('.eyebrow').textContent = t.toolbox; headings[0].querySelector('h2').textContent = t.techTitle;
  headings[1].querySelector('.eyebrow').textContent = t.career; headings[1].querySelector('h2').innerHTML = t.cvTitle; headings[1].querySelector('p:last-child').textContent = t.cvText;
  headings[2].querySelector('.eyebrow').textContent = t.work; headings[2].querySelector('h2').textContent = t.workTitle; headings[2].querySelector('.text-link').childNodes[0].textContent = `${t.all} `;
  renderResumes(language);
  const projectAction = language === 'fr' ? 'Voir l’application web' : language === 'en' ? 'View web application' : 'Ver aplicación web';
  document.querySelectorAll('.projects-grid .project-card').forEach((card, i) => { card.querySelector('.project-type').textContent = t.types[i]; card.querySelector('.project-info a').childNodes[0].textContent = `${projectAction} `; });
  applyCustomProfile();
  localStorage.setItem('soumias-portfolio-language', language);
}
const languageSelector = get('languageSelector');
languageSelector.value = localStorage.getItem('soumias-portfolio-language') || 'es';
setLanguage(languageSelector.value);
languageSelector.addEventListener('change', () => setLanguage(languageSelector.value));
async function loadServerContent() {
  try {
    const response = await fetch('/api/content', { cache: 'no-store' });
    const saved = await response.json();
    if (!saved) return;
    content = { ...defaults, ...saved };
    content.technologies ||= [
      { name: 'Frontend', description: 'HTML · CSS · JavaScript · TypeScript · Angular', image: '' },
      { name: 'Backend', description: 'Java · PHP · Spring Boot · APIs REST', image: '' },
      { name: 'Datos', description: 'MySQL Server · Workbench · Bases de datos relacionales', image: '' },
      { name: 'Entrega', description: 'Git · Control de versiones · Despliegue web', image: '' }
    ];
    content.projects = (content.projects || defaults.projects).map((project) => ({ ...project, description: project.description || '', image: project.image || '' }));
    content.resumes ||= {}; content.contact ||= {}; content.profile ||= { title: '', introduction: '', name: 'Soumia Abdelaati Lamrahi', role: 'Desarrolladora Web' }; content.profile.name ||= 'Soumia Abdelaati Lamrahi'; content.profile.role ||= 'Desarrolladora Web';
    render(); setLanguage(languageSelector.value);
  } catch { /* The public static site can still be displayed without the local demo server. */ }
}
loadServerContent();

const extendedEditor = document.createElement('div');
extendedEditor.innerHTML = `<fieldset><legend>Tecnologías</legend>${[0, 1, 2, 3].map((i) => `<label>Tecnología ${i + 1} — nombre<input type="text" data-tech-name="${i}"></label><label>Tecnología ${i + 1} — descripción<input type="text" data-tech-description="${i}"></label><label>Imagen de tecnología ${i + 1}<input type="file" data-tech-image="${i}" accept="image/*"></label>`).join('')}</fieldset><fieldset><legend>Detalles visuales de proyectos</legend>${[0, 1, 2].map((i) => `<label>Proyecto ${i + 1} — descripción<input type="text" data-project-description="${i}"></label><label>Imagen del proyecto ${i + 1}<input type="file" data-project-image="${i}" accept="image/*"></label>`).join('')}</fieldset><fieldset><legend>Currículums visuales</legend>${['es', 'en', 'fr', 'ar'].map((language) => `<label>Descripción CV ${language.toUpperCase()}<input type="text" data-resume-description="${language}"></label><label>Imagen de portada CV ${language.toUpperCase()}<input type="file" data-resume-image="${language}" accept="image/*"></label>`).join('')}</fieldset><fieldset><legend>Contacto</legend><label>Email<input type="email" data-contact="email"></label><label>LinkedIn (enlace)<input type="url" data-contact="linkedin" placeholder="https://linkedin.com/in/..."></label><label>Teléfono<input type="tel" data-contact="phone"></label><label>WhatsApp (prefijo y número)<input type="tel" data-contact="whatsapp" placeholder="34600000000"></label></fieldset>`;
extendedEditor.insertAdjacentHTML('afterbegin', '<fieldset><legend>Perfil</legend><label>Nombre completo<input type="text" data-profile-name="true"></label><label>Título profesional<input type="text" data-profile-role="true" placeholder="Desarrolladora Web"></label><label>Titular grande<input type="text" data-profile-title="true" placeholder="Construyo experiencias web claras y funcionales."></label><label>Texto de presentación<textarea data-profile-introduction="true" rows="4" placeholder="Escribe tu presentación profesional..."></textarea></label></fieldset>');
get('editorForm').querySelector('.save-note').before(extendedEditor);

const editorForm = get('editorForm');
const editorFieldsets = [...editorForm.querySelectorAll('fieldset')];
const adminGroups = {
  profile: [editorForm.querySelector('.file-field'), editorFieldsets[2]],
  contact: [editorFieldsets[6]],
  technologies: [editorFieldsets[3]],
  curriculums: [editorFieldsets[0], editorFieldsets[5]],
  projects: [editorFieldsets[1], editorFieldsets[4]]
};
const adminSidebar = document.createElement('nav');
adminSidebar.className = 'admin-sidebar';
adminSidebar.innerHTML = '<button type="button" data-admin-tab="profile">1 · Perfil</button><button type="button" data-admin-tab="contact">2 · Contacto</button><button type="button" data-admin-tab="technologies">3 · Tecnologías</button><button type="button" data-admin-tab="curriculums">4 · Currículums</button><button type="button" data-admin-tab="projects">5 · Proyectos</button>';
get('adminEditor').insertBefore(adminSidebar, editorForm);
function activateAdminTab(tab) {
  Object.entries(adminGroups).forEach(([name, nodes]) => nodes.filter(Boolean).forEach((node) => { node.hidden = name !== tab; }));
  adminSidebar.querySelectorAll('button').forEach((button) => button.classList.toggle('is-active', button.dataset.adminTab === tab));
}
adminSidebar.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => activateAdminTab(button.dataset.adminTab)));
activateAdminTab('profile');

const existingSaveButton = editorForm.querySelector('.button-primary');
const editorActions = document.createElement('div');
editorActions.className = 'editor-actions';
editorActions.innerHTML = '<button type="button" class="editor-cancel" id="cancelEditor">Cancelar</button><div class="editor-actions-right"><button type="button" class="editor-close" id="closeEditor">Cerrar</button></div>';
editorActions.querySelector('.editor-actions-right').prepend(existingSaveButton);
editorForm.append(editorActions);
existingSaveButton.type = 'button';
existingSaveButton.addEventListener('click', () => editorForm.dispatchEvent(new Event('submit', { cancelable: true })));
get('cancelEditor').addEventListener('click', () => window.location.reload());
get('closeEditor').addEventListener('click', () => dialog.close());

const pendingUploads = new Set();
function readImage(input, callback) {
  const file = input.files?.[0];
  if (!file) return Promise.resolve();
  const task = new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => { callback(reader.result); resolve(); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  pendingUploads.add(task); task.finally(() => pendingUploads.delete(task));
  return task;
}
document.querySelectorAll('[data-tech-image]').forEach((input) => input.addEventListener('change', () => readImage(input, (data) => { content.technologies[Number(input.dataset.techImage)].image = data; updateAdminPreviews(); })));
document.querySelectorAll('[data-project-image]').forEach((input) => input.addEventListener('change', () => readImage(input, (data) => { content.projects[Number(input.dataset.projectImage)].image = data; updateAdminPreviews(); })));
document.querySelectorAll('[data-resume-image]').forEach((input) => input.addEventListener('change', () => readImage(input, (data) => { const language = input.dataset.resumeImage; content.resumes[language] ||= {}; content.resumes[language].image = data; updateAdminPreviews(); })));
function updateAdminPreviews() {
  document.querySelectorAll('[data-tech-image], [data-project-image], [data-resume-image]').forEach((input) => {
    const image = input.dataset.techImage !== undefined ? content.technologies[Number(input.dataset.techImage)]?.image : input.dataset.projectImage !== undefined ? content.projects[Number(input.dataset.projectImage)]?.image : content.resumes[input.dataset.resumeImage]?.image;
    let preview = input.closest('label').querySelector('.admin-image-preview');
    if (!preview) { preview = document.createElement('img'); preview.className = 'admin-image-preview'; input.closest('label').append(preview); }
    preview.src = image || ''; preview.hidden = !image;
  });
  document.querySelectorAll('[data-resume]').forEach((input) => {
    const file = content.resumes[input.dataset.resume];
    let status = input.closest('label').querySelector('.admin-file-status');
    if (!status) { status = document.createElement('small'); status.className = 'admin-file-status'; input.closest('label').append(status); }
    status.textContent = file?.name ? `PDF cargado: ${file.name}` : 'Sin PDF cargado';
  });
}
function populateExtendedEditor() {
  document.querySelector('[data-profile-name]').value = content.profile.name || '';
  document.querySelector('[data-profile-role]').value = content.profile.role || '';
  document.querySelector('[data-profile-title]').value = content.profile.title || '';
  document.querySelector('[data-profile-introduction]').value = content.profile.introduction || '';
  content.technologies.forEach((tech, i) => { document.querySelector(`[data-tech-name="${i}"]`).value = tech.name || ''; document.querySelector(`[data-tech-description="${i}"]`).value = tech.description || ''; });
  content.projects.forEach((project, i) => document.querySelector(`[data-project-description="${i}"]`).value = project.description || '');
  ['es', 'en', 'fr', 'ar'].forEach((language) => { document.querySelector(`[data-resume-description="${language}"]`).value = content.resumes[language]?.description || ''; });
  Object.entries(content.contact).forEach(([key, value]) => { const input = document.querySelector(`[data-contact="${key}"]`); if (input) input.value = value || ''; });
  updateAdminPreviews();
}
get('editorForm').addEventListener('submit', async () => {
  await Promise.all([...pendingUploads]);
  content.profile.name = document.querySelector('[data-profile-name]').value.trim();
  content.profile.role = document.querySelector('[data-profile-role]').value.trim();
  content.profile.title = document.querySelector('[data-profile-title]').value.trim();
  content.profile.introduction = document.querySelector('[data-profile-introduction]').value.trim();
  content.technologies = content.technologies.map((tech, i) => ({ ...tech, name: document.querySelector(`[data-tech-name="${i}"]`).value.trim() || tech.name, description: document.querySelector(`[data-tech-description="${i}"]`).value.trim() }));
  content.projects = content.projects.map((project, i) => ({ ...project, description: document.querySelector(`[data-project-description="${i}"]`).value.trim() }));
  ['es', 'en', 'fr', 'ar'].forEach((language) => { content.resumes[language] ||= {}; content.resumes[language].description = document.querySelector(`[data-resume-description="${language}"]`).value.trim(); });
  ['email', 'linkedin', 'phone', 'whatsapp'].forEach((key) => { content.contact[key] = document.querySelector(`[data-contact="${key}"]`).value.trim(); });
  render(); applyCustomProfile();
  persist().then((saved) => { if (saved) get('saveNote').textContent = 'Cambios guardados en el servidor local.'; });
});

document.body.insertAdjacentHTML('beforeend', '<dialog class="resume-viewer" id="resumeViewer"><button type="button" class="dialog-close" id="closeResumeViewer" aria-label="Cerrar currículum">×</button><div id="resumeViewerPages" class="resume-viewer-pages"></div></dialog>');
get('closeResumeViewer').addEventListener('click', () => { get('resumeViewer').close(); get('resumeViewerPages').innerHTML = ''; });
