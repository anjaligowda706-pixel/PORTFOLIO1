import { useEffect, useRef, useState } from 'react'
import { profile, skills, experience, projects, education, certs } from './data.js'

const nav = ['About', 'Experience', 'Projects', 'Skills', 'Education', 'Contact']
const roles = ['Backend Developer', 'Python Developer', 'Full Stack Developer', 'ML Enthusiast']

// Live projects. If a project in data.js has a name containing `match`, the live link is attached to it.
// Otherwise it is added as a new card at the top. Add a `link:` line to show a GitHub button too.
const liveProjects = [
  {
    match: 'EduPredict',
    name: 'EduPredict: AI Student Performance Prediction',
    text: 'A web app that predicts student performance from academic and behavioural inputs using a trained machine learning model. First load may take a moment.',
    stack: ['Python', 'Scikit-learn'],
    live: 'https://edupredict-1-74el.onrender.com/index.html',
  },
  {
    match: 'Build and Release',
    name: 'Intelligent Build and Release Manager',
    text: 'A tool that automates and tracks software builds and releases, with a live deployed dashboard. First load may take a moment.',
    stack: ['Node.js'],
    live: 'https://intelligent-build-and-release-manager-y7qx.onrender.com',
  },
]
const has = (p, l) => p.name.toLowerCase().includes(l.match.toLowerCase())
const allProjects = [
  ...liveProjects.filter((l) => !projects.some((p) => has(p, l))).map(({ match, ...rest }) => rest),
  ...projects.map((p) => {
    const l = liveProjects.find((x) => has(p, x))
    return l ? { ...p, live: l.live } : p
  }),
]

function Typing() {
  const [i, setI] = useState(0)
  const [txt, setTxt] = useState('')
  const [del, setDel] = useState(false)
  useEffect(() => {
    const full = roles[i]
    const t = setTimeout(() => {
      if (!del) {
        setTxt(full.slice(0, txt.length + 1))
        if (txt.length + 1 === full.length) setTimeout(() => setDel(true), 1200)
      } else {
        setTxt(full.slice(0, txt.length - 1))
        if (txt.length <= 1) { setDel(false); setI((i + 1) % roles.length) }
      }
    }, del ? 40 : 80)
    return () => clearTimeout(t)
  }, [txt, del, i])
  return <span className="typing">{txt}<i className="caret" /></span>
}

function Counter({ to, decimals = 0, suffix = '' }) {
  const ref = useRef(null)
  const [v, setV] = useState(0)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const p = Math.min((now - start) / 1400, 1)
        setV(to * (1 - Math.pow(1 - p, 3)))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [to])
  return <span ref={ref}>{v.toFixed(decimals)}{suffix}</span>
}

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`)
  e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`)
}

function Particles() {
  const ref = useRef(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const c = ref.current, x = c.getContext('2d')
    let w, h, raf
    const mouse = { x: -999, y: -999 }
    const N = Math.min(60, Math.floor(window.innerWidth / 22))
    const ps = Array.from({ length: N }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35 }))
    const size = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight }
    size()
    const mm = (e) => { mouse.x = e.clientX; mouse.y = e.clientY }
    const draw = () => {
      x.clearRect(0, 0, w, h)
      ps.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        x.beginPath(); x.arc(p.x, p.y, 2, 0, 6.283); x.fillStyle = 'rgba(196,102,138,.55)'; x.fill()
        for (let j = i + 1; j < N; j++) {
          const q = ps[j], d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 130) { x.strokeStyle = `rgba(91,52,114,${0.16 * (1 - d / 130)})`; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke() }
        }
        const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y)
        if (dm < 160) { x.strokeStyle = `rgba(196,102,138,${0.4 * (1 - dm / 160)})`; x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(mouse.x, mouse.y); x.stroke() }
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', size)
    window.addEventListener('mousemove', mm)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', size); window.removeEventListener('mousemove', mm) }
  }, [])
  return <canvas ref={ref} className="net" aria-hidden="true" />
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="section">
      <h2 className="reveal">{title}</h2>
      {children}
    </section>
  )
}

export default function App() {
  const bar = useRef(null)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('All')
  const glow = useRef(null)
  useEffect(() => {
    const m = (e) => { if (glow.current) glow.current.style.transform = `translate(${e.clientX}px,${e.clientY}px)` }
    window.addEventListener('mousemove', m)
    return () => window.removeEventListener('mousemove', m)
  }, [])
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    const els = [...document.querySelectorAll('.btn')]
    const mv = (e) => {
      const r = e.currentTarget.getBoundingClientRect()
      e.currentTarget.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`
    }
    const lv = (e) => { e.currentTarget.style.transform = '' }
    els.forEach((el) => { el.addEventListener('mousemove', mv); el.addEventListener('mouseleave', lv) })
    return () => els.forEach((el) => { el.removeEventListener('mousemove', mv); el.removeEventListener('mouseleave', lv) })
  }, [])
  const tilt = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 12}deg`)
    e.currentTarget.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`)
  }
  const untilt = (e) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg') }
  const shown = filter === 'All' ? allProjects : allProjects.filter((p) => p.stack.includes(filter))

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    const so = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    document.querySelectorAll('section[id]').forEach((el) => so.observe(el))
    const onScroll = () => {
      const h = document.documentElement
      bar.current.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight)})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { io.disconnect(); so.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  return (
    <>
      <div className="aurora" aria-hidden="true"><b /><b /><b /></div>
      <Particles />
      <div className="glow" ref={glow} aria-hidden="true" />
      <div className="progress" ref={bar} />

      <header className="top">
        <a href="#top" className="brand" aria-label="Anjali N home">
          <img src="/profile.jpg" alt="" />
          <span>Anjali N</span>
        </a>
        <button className="burger" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
          <span /><span />
        </button>
        <nav className={open ? 'open' : ''} aria-label="Main">
          {nav.map((n) => (
            <a key={n} href={`#${n.toLowerCase()}`} className={active === n.toLowerCase() ? 'on' : ''} onClick={() => setOpen(false)}>{n}</a>
          ))}
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-text">
            <p className="hello"><span className="live" /> Open to work · {profile.location}</p>
            <h1 aria-label="Hi, I'm Anjali N">
              <span className="wd" style={{ '--i': 0 }} aria-hidden="true">Hi,</span>{' '}
              <span className="wd" style={{ '--i': 1 }} aria-hidden="true">I'm</span>{' '}
              <span className="wd grad" style={{ '--i': 2 }} aria-hidden="true">Anjali N</span>
            </h1>
            <p className="role"><Typing /></p>
            <p className="lead">I build backends, APIs and Android apps with Python, Node.js and MongoDB, from the first endpoint to the final APK.</p>
            <div className="actions">
              <a className="btn primary" href="#projects">View projects</a>
              <a className="btn" href="/Anjali_N_Resume.pdf" download>Download resume</a>
            </div>
            <div className="social">
              <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={`mailto:${profile.email}`}>Email</a>
            </div>
          </div>

          <div className="avatar-wrap" onMouseMove={tilt} onMouseLeave={untilt}>
            <div className="ring" />
            <img className="avatar" src="/profile.jpg" alt="Portrait of Anjali N" />
            <svg className="orbit" viewBox="0 0 200 200" aria-hidden="true">
              <defs><path id="circ" d="M100,100 m-90,0 a90,90 0 1,1 180,0 a90,90 0 1,1 -180,0" /></defs>
              <text><textPath href="#circ" textLength="560" lengthAdjust="spacing">Backend Developer ✦ Python ✦ APIs ✦ Android ✦ Machine Learning ✦ MongoDB ✦ </textPath></text>
            </svg>
            <div className="code" aria-hidden="true">
              <div><b className="m">GET</b> /api/anjali</div>
              <div>{'{'}</div>
              <div className="in1"><b className="k">"role"</b>: <b className="v">"Backend Dev"</b>,</div>
              <div className="in1"><b className="k">"stack"</b>: <b className="v">["Python","Node"]</b>,</div>
              <div className="in1"><b className="k">"status"</b>: <b className="v">"open_to_work"</b></div>
              <div>{'}'}</div>
            </div>
          </div>
        </section>

        <div className="stats reveal">
          <div><b><Counter to={8.11} decimals={2} /></b><span>CGPA</span></div>
          <div><b><Counter to={2} /></b><span>Internships</span></div>
          <div><b><Counter to={5} suffix="+" /></b><span>Projects</span></div>
          <div><b><Counter to={10} suffix="+" /></b><span>Certifications</span></div>
        </div>

        <Section id="about" title="About me">
          <p className="prose reveal">{profile.summary}</p>
          <p className="prose reveal">I am looking for Software Engineer, Backend, Full Stack or Python Developer roles.</p>
        </Section>

        <Section id="experience" title="Experience">
          <div className="timeline">
            {experience.map((e) => (
              <article key={e.org} className="job reveal" onMouseMove={spot}>
                <span className="node" />
                <p className="when">{e.when}</p>
                <h3>{e.title}</h3>
                <p className="org">{e.org}, {e.place}</p>
                <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </article>
            ))}
          </div>
        </Section>

        <Section id="projects" title="Projects">
          <div className="filters reveal" role="group" aria-label="Filter projects">
            {['All', 'Python', 'Node.js', 'Android', 'Scikit-learn'].map((f) => (
              <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{f === 'Scikit-learn' ? 'ML' : f}</button>
            ))}
          </div>
          <div className="projects">
            {shown.map((p) => (
              <article key={p.name} className="project reveal" onMouseMove={spot}>
                <h3>{p.name}</h3>
                <p>{p.text}</p>
                <ul className="tags">{p.stack.map((t) => <li key={t}>{t}</li>)}</ul>
                {(p.live || p.link) && (
                  <div className="links">
                    {p.live && (
                      <a className="live-link" href={p.live} target="_blank" rel="noreferrer">
                        <span className="live" /> Live demo
                      </a>
                    )}
                    {p.link && <a href={p.link} target="_blank" rel="noreferrer">View on GitHub</a>}
                  </div>
                )}
              </article>
            ))}
          </div>
          <p className="more reveal"><a href={profile.github} target="_blank" rel="noreferrer">See all repositories on GitHub</a></p>
        </Section>

        <Section id="skills" title="Skills">
          <div className="skills">
            {skills.map(([k, v]) => (
              <div key={k} className="skill reveal" onMouseMove={spot}>
                <h3>{k}</h3>
                <ul className="tags">{v.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="education" title="Education and certifications">
          <div className="edu">
            <div>
              {education.map(([deg, school, yrs, score]) => (
                <article key={deg} className="edu-item reveal">
                  <h3>{deg}</h3>
                  <p>{school}</p>
                  <p className="when">{yrs} · {score}</p>
                </article>
              ))}
              <p className="when reveal">Languages: Kannada (native), English (professional)</p>
            </div>
            <ul className="certs reveal">{certs.map((c) => <li key={c}>{c}</li>)}</ul>
          </div>
        </Section>

        <Section id="contact" title="Let's work together">
          <p className="prose reveal">I'm open to backend, full stack and Python roles. Email is the quickest way to reach me.</p>
          <div className="contact reveal">
            <a className="btn primary" href={`mailto:${profile.email}`}>{profile.email}</a>
            <a className="btn" href={`tel:+91${profile.phone}`}>{profile.phone}</a>
            <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="btn" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </Section>
      </main>
      <footer>© {new Date().getFullYear()} Anjali N, Bengaluru</footer>
    </>
  )
}
