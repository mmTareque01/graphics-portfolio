// Everything here comes from public GitHub info and project READMEs — edit freely.
export const profile = {
  name: 'Md Muhimenul Tareque',
  short: 'Muhimenul Tareque',
  role: 'Software Engineer',
  location: 'Bangladesh',
  email: 'mmtareque@yahoo.com',
  github: 'https://github.com/mmTareque01',
  linkedin: 'https://www.linkedin.com/in/mmtareque/',
  upwork: 'https://www.upwork.com/freelancers/~01d7acd506a83cc8b6',
};

// Featured case studies. `art` picks the generative cover; `shots` use real screenshots.
export const work = [
  {
    id: 'edupathway',
    title: 'EduPathway',
    tag: 'Multi-tenant SaaS',
    year: 'Tronixora',
    blurb: 'A multi-tenant platform for study-abroad consultancies. Every agency gets its own branded public website, a student portal and an admissions CRM — all served from a single deployment.',
    points: ['Tenant-aware routing & branding', 'Student portal + admissions CRM', 'Rich-text content & media pipeline'],
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Cloudinary', 'TipTap'],
    art: 'tenants', c1: '#5ef2ff', c2: '#3a5bff',
  },
  {
    id: 'dentalflow',
    title: 'DentalFlow',
    tag: 'Clinic management SaaS',
    year: 'Healthcare',
    blurb: 'Mobile-first software for dental clinics: patients, appointments, custom e-prescriptions, offline SMS confirmations and one-tap PDF / print / share of prescriptions.',
    points: ['Mobile-first scheduling', 'Server-side PDF prescriptions', 'Offline SMS confirmations'],
    stack: ['Next.js 15', 'React 19', 'Prisma', 'PostgreSQL', 'NextAuth', 'TanStack Query', 'Zod'],
    art: 'pulse', c1: '#7dffb2', c2: '#00a37a',
    links: { code: 'https://github.com/mmTareque01/dental-flow' },
  },
  {
    id: 'reels',
    title: 'Reels Maker',
    tag: 'AI video pipeline',
    year: 'Automation',
    blurb: 'Product JSON in, finished 1080×1920 reel out. An LLM writes the script, keywords pull stock b-roll, text-to-speech records the voiceover and Whisper burns in word-timed captions.',
    points: ['LLM script generation', 'TTS voiceover + Whisper captions', 'Automated vertical video render'],
    stack: ['Python', 'LLM APIs', 'TTS', 'Whisper', 'Video rendering'],
    art: 'wave', c1: '#ff6ad5', c2: '#8b5cff',
  },
  {
    id: 'agents',
    title: 'Personal Assistant',
    tag: 'Multi-agent system',
    year: 'AI agents',
    blurb: 'A self-hosted assistant running on a Raspberry Pi: 28 n8n workflows in five layers — watchers for mail, Slack, GitHub and calendar, an orchestrator brain, and specialist sub-agents that report over Telegram.',
    points: ['28 workflows · 5 layers', 'Orchestrator + specialist sub-agents', 'Runs on a Raspberry Pi'],
    stack: ['n8n', 'PostgreSQL', 'Gemini', 'Telegram', 'Raspberry Pi'],
    art: 'graph', c1: '#ffb86b', c2: '#ff5d5d',
  },
  {
    id: 'motion',
    title: 'Motion Commerce',
    tag: 'WebGL storefronts',
    year: 'Creative dev',
    blurb: 'Three immersive storefronts — a perfume maison with real-time glass and a flower-to-flacon sequence, headphones that explode into parts on scroll, and a toy shop you can play with.',
    points: ['Real-time 3D with Three.js', 'Scroll-driven GSAP choreography', 'Working cart & product flows'],
    stack: ['Three.js', 'WebGL', 'GSAP', 'Lenis', 'Vite'],
    shots: ['/work/aurele.jpg', '/work/nova-2.jpg', '/work/wobble.jpg'],
    c1: '#e9cf9b', c2: '#ff4f1f',
    links: {
      live: 'https://perfume-one-blond.vercel.app',
      live2: 'https://audio-store-one.vercel.app',
      code: 'https://github.com/mmTareque01/perfume',
    },
  },
  {
    id: 'openhub',
    title: 'OpenHub',
    tag: 'Open-source marketplace',
    year: 'Platform',
    blurb: 'A home for open-source projects — full details, how to use them and how to turn them into a business. Visitors can “knock” for technical help; admins get analytics and a bulk CSV import tool.',
    points: ['Search + category / difficulty filters', 'Admin panel & analytics', 'Bulk data import'],
    stack: ['Next.js 16', 'React 19', 'Tailwind v4', 'PostgreSQL', 'Zod'],
    art: 'orbit', c1: '#a0ff6a', c2: '#2bd9a0',
  },
];

export const more = [
  { title: 'Pod-Share', desc: 'Share files by link or QR code — no signup, optional password and expiry.', stack: 'React · Node', href: 'https://github.com/mmTareque01/pod-share' },
  { title: 'MT Agro Foods', desc: 'Single-vendor e-commerce for homemade foods with guest checkout and COD.', stack: 'Next.js 16 · Prisma' },
  { title: 'BD Medicine API', desc: 'Scraped medicine data served through a rate-limited public API.', stack: 'Next.js · Supabase · Redis' },
  { title: 'MT Care', desc: 'Patient registration and appointment management for healthcare.', stack: 'Next.js · TypeScript', href: 'https://mt-care.vercel.app' },
  { title: 'Hospital Management', desc: 'Admin system for patients, doctors and records.', stack: 'React · Node', href: 'https://hospital-management-one-gamma.vercel.app' },
  { title: 'Offline Caller', desc: 'A lightweight calling utility web app.', stack: 'React', href: 'https://offline-caller.vercel.app' },
  { title: 'Video App', desc: 'Video sharing client with its own Node back end.', stack: 'React · Express', href: 'https://github.com/mmTareque01/vidoa-app-client' },
  { title: 'Blogger Automation', desc: 'Automated publishing through the Google Blogger API.', stack: 'Python', href: 'https://github.com/mmTareque01/blogger-api-automation' },
  { title: 'Home Automation', desc: 'Controlling home appliances with a Raspberry Pi.', stack: 'Raspberry Pi · JS', href: 'https://github.com/mmTareque01/home_automation_using_rasberry_pi' },
  { title: 'School Management', desc: 'School administration built with Ruby on Rails.', stack: 'Ruby on Rails', href: 'https://github.com/mmTareque01/school-management-using-ror' },
  { title: 'E-commerce', desc: 'Storefront with a React client and Django back end.', stack: 'React · Django', href: 'https://github.com/mmTareque01/ecommerce-using-react-django' },
  { title: 'Steganography', desc: 'Hiding messages inside images.', stack: 'PowerShell', href: 'https://github.com/mmTareque01/Steganography' },
];

export const oss = [
  {
    name: 'react-smooth-hash-link',
    cmd: 'npm i react-smooth-hash-link',
    desc: 'Fixes React Router’s missing scroll-to-#hash behaviour with a drop-in <HashLink>. Smooth-scrolls to the matching element, even ones rendered later.',
    href: 'https://github.com/mmTareque01/react-smooth-hash-link',
  },
  {
    name: 'make-express-api',
    cmd: 'npx make-express-api user',
    desc: 'A CLI inspired by Rails scaffolding: one command generates a full CRUD API module for Express — routes, controller and model.',
    href: 'https://github.com/mmTareque01/make-express-api',
  },
];

export const stack = [
  { group: 'Back end', items: ['Node.js', 'NestJS', 'Express', 'Django', 'Ruby on Rails', 'WebSockets', 'GraphQL', 'RabbitMQ'] },
  { group: 'Front end', items: ['TypeScript', 'React', 'Next.js', 'React Native', 'Redux', 'Tailwind', 'Three.js', 'GSAP'] },
  { group: 'Data', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Prisma', 'TypeORM', 'Sequelize'] },
  { group: 'Cloud & AI', items: ['Docker', 'AWS', 'Nginx', 'Linux', 'n8n', 'LLM APIs', 'Whisper', 'Python ML'] },
];

export const journey = [
  { when: 'Now', where: 'Quantic Dynamics', what: 'Building production software — and open to new opportunities.' },
  { when: 'Also', where: 'Abroadinquiry', what: 'Engineering for the study-abroad space.' },
  { when: 'Ongoing', where: 'Freelance · Upwork', what: 'Shipping APIs, dashboards and automation for clients worldwide.' },
  { when: '2020', where: 'GitHub', what: 'First public commit. 57 repositories later, still shipping.' },
];
