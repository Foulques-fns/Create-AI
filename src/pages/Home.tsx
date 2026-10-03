import { useMemo, useState } from 'react'

type ProjectFile = { name: string; language: string; content: string }

type GeneratedProject = {
  name: string
  description: string
  files: ProjectFile[]
  html: string
}

const starterPrompts = [
  'Crée un portfolio moderne pour un développeur avec une section projets, compétences et contact.',
  'Crée une landing page premium pour une application mobile avec hero, fonctionnalités, tarifs et FAQ.',
  'Crée un dashboard SaaS sombre avec statistiques, graphiques, activité récente et navigation latérale.',
]

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char] || char))
}

function buildProject(prompt: string): GeneratedProject {
  const lower = prompt.toLowerCase()
  const isDashboard = lower.includes('dashboard') || lower.includes('saas')
  const isPortfolio = lower.includes('portfolio')
  const title = isDashboard ? 'Nova Dashboard' : isPortfolio ? 'Creator Portfolio' : 'CreateAI Project'
  const safePrompt = escapeHtml(prompt)

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>${title}</title>
<style>
*{box-sizing:border-box}body{margin:0;font-family:Inter,system-ui,sans-serif;background:#070b14;color:#f7f9ff}a{text-decoration:none;color:inherit}.wrap{max-width:1180px;margin:auto;padding:24px}.nav{display:flex;justify-content:space-between;align-items:center;padding:18px 0}.brand{font-size:22px;font-weight:800}.pill{border:1px solid #26334e;background:#10182a;padding:10px 16px;border-radius:999px}.hero{padding:100px 0 70px;text-align:center}.eyebrow{display:inline-block;padding:8px 14px;border-radius:999px;background:#0d4dff1c;color:#74a2ff;border:1px solid #1748a8}.hero h1{font-size:clamp(42px,7vw,82px);line-height:.98;margin:22px auto;max-width:900px}.hero p{max-width:680px;margin:0 auto;color:#9ba7bf;font-size:19px;line-height:1.7}.cta{display:inline-block;margin-top:32px;background:#1769ff;padding:15px 23px;border-radius:14px;font-weight:700}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:35px 0 80px}.card{padding:25px;border:1px solid #1d2940;background:linear-gradient(145deg,#101827,#0a101d);border-radius:22px}.card h3{margin-top:0}.muted{color:#8996ad;line-height:1.6}.stat{font-size:34px;font-weight:800}.footer{padding:40px 0;border-top:1px solid #1d2940;color:#75829a}@media(max-width:800px){.grid{grid-template-columns:1fr}.hero{text-align:left;padding-top:60px}}
</style></head>
<body><div class="wrap">
<nav class="nav"><div class="brand">${title}</div><a class="pill" href="#contact">Contact</a></nav>
<section class="hero"><span class="eyebrow">Generated with CreateAI</span><h1>${isDashboard ? 'Your data. One powerful workspace.' : isPortfolio ? 'Build a portfolio that gets remembered.' : 'Turn your idea into a beautiful website.'}</h1><p>${safePrompt}</p><a class="cta" href="#features">Explore the project</a></section>
<section id="features" class="grid">
<div class="card"><div class="stat">01</div><h3>Premium design</h3><p class="muted">A responsive interface with modern spacing, typography and polished visual hierarchy.</p></div>
<div class="card"><div class="stat">02</div><h3>Responsive</h3><p class="muted">The generated layout adapts to desktop, tablet and mobile screens.</p></div>
<div class="card"><div class="stat">03</div><h3>Ready to edit</h3><p class="muted">The project is separated into simple files so you can continue building it.</p></div>
</section>
${isDashboard ? '<section class="grid"><div class="card"><h3>Revenue</h3><div class="stat">€24,890</div><p class="muted">+18.4% this month</p></div><div class="card"><h3>Users</h3><div class="stat">12,480</div><p class="muted">+8.2% this month</p></div><div class="card"><h3>Conversion</h3><div class="stat">7.8%</div><p class="muted">+1.4% this month</p></div></section>' : ''}
<footer id="contact" class="footer">Generated project • Edit the files in CreateAI</footer></div></body></html>`

  const css = `/* CreateAI generated styles */\nbody { margin: 0; font-family: Inter, system-ui, sans-serif; }\n/* The complete preview is available in index.html */`
  const js = `// CreateAI generated project\nconsole.log('Project generated from prompt:', ${JSON.stringify(prompt)})`

  return {
    name: title,
    description: `Generated from: ${prompt}`,
    html,
    files: [
      { name: 'index.html', language: 'HTML', content: html },
      { name: 'style.css', language: 'CSS', content: css },
      { name: 'script.js', language: 'JavaScript', content: js },
      { name: 'README.md', language: 'Markdown', content: `# ${title}\n\n${prompt}\n\nGenerated with CreateAI.` },
    ],
  }
}

function Home() {
  const [prompt, setPrompt] = useState('')
  const [project, setProject] = useState<GeneratedProject | null>(null)
  const [activeFile, setActiveFile] = useState('index.html')
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [generating, setGenerating] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const selectedFile = useMemo(() => project?.files.find((file) => file.name === activeFile), [project, activeFile])

  const generate = () => {
    const value = prompt.trim()
    if (!value) return
    setGenerating(true)
    setTimeout(() => {
      const next = buildProject(value)
      setProject(next)
      setActiveFile('index.html')
      setActiveTab('preview')
      setHistory((items) => [value, ...items.filter((item) => item !== value)].slice(0, 5))
      setGenerating(false)
    }, 650)
  }

  const downloadProject = () => {
    if (!project) return
    const crcTable = Array.from({ length: 256 }, (_, n) => {
      let c = n
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1)
      return c >>> 0
    })
    const crc32 = (bytes: Uint8Array) => {
      let c = 0xffffffff
      for (const b of bytes) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
      return (c ^ 0xffffffff) >>> 0
    }
    const enc = new TextEncoder()
    const chunks: Uint8Array[] = []
    const central: Uint8Array[] = []
    let offset = 0
    const u16 = (v: number) => new Uint8Array([v & 255, (v >>> 8) & 255])
    const u32 = (v: number) => new Uint8Array([v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255])
    const concat = (parts: Uint8Array[]) => { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let i = 0; parts.forEach(p => { out.set(p, i); i += p.length }); return out }
    project.files.forEach(file => {
      const name = enc.encode(file.name), data = enc.encode(file.content), crc = crc32(data)
      const local = concat([new Uint8Array([80,75,3,4]), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), name, data])
      chunks.push(local)
      const record = concat([new Uint8Array([80,75,1,2]), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name])
      central.push(record); offset += local.length
    })
    const centralBytes = concat(central)
    const end = concat([new Uint8Array([80,75,5,6]), u16(0), u16(0), u16(project.files.length), u16(project.files.length), u32(centralBytes.length), u32(offset), u16(0)])
    const blob = new Blob([concat([...chunks, centralBytes, end])], { type: 'application/zip' })
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.zip`; a.click(); URL.revokeObjectURL(url)
  }

  return <main className="min-h-screen bg-[#070b14] text-white">
    <div className="pointer-events-none fixed inset-0 overflow-hidden"><div className="absolute left-1/2 top-[-240px] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[#1769ff]/15 blur-[120px]" /><div className="absolute right-[-150px] top-1/2 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[110px]" /></div>

    <header className="relative z-10 border-b border-white/10 bg-[#070b14]/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#4b8cff] to-[#1769ff] font-black shadow-[0_0_30px_rgba(23,105,255,.35)]">C</div><span className="text-xl font-bold tracking-tight">CreateAI</span><span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/45">Studio</span></div>
        <div className="hidden items-center gap-7 text-sm text-white/55 md:flex"><a href="#create" className="transition hover:text-white">Create</a><a href="#workspace" className="transition hover:text-white">Workspace</a><a href="#history" className="transition hover:text-white">History</a></div>
        <button onClick={downloadProject} disabled={!project} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30">Download</button>
      </div>
    </header>

    <section id="create" className="relative z-10 mx-auto max-w-7xl px-6 pb-12 pt-20 text-center md:pt-28">
      <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[#377cff]/25 bg-[#377cff]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.18em] text-[#82aaff]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#4d8dff]" /> AI Project Generator</div>
      <h1 className="mx-auto max-w-5xl text-5xl font-bold leading-[.98] tracking-[-.045em] md:text-7xl">Create anything.<br/><span className="bg-gradient-to-r from-white via-[#9bbcff] to-[#4d8dff] bg-clip-text text-transparent">Start with an idea.</span></h1>
      <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/50 md:text-lg">Describe the website or application you want. CreateAI turns your brief into a real editable project with files and a live preview.</p>

      <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-white/10 bg-white/[.045] p-2 shadow-[0_25px_100px_rgba(0,0,0,.35)] backdrop-blur-xl">
        <div className="rounded-[20px] bg-[#0a101c] p-4 md:p-5"><textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generate() }} placeholder="Décris ce que tu veux créer..." rows={4} className="w-full resize-none bg-transparent px-2 py-1 text-left text-base leading-7 text-white outline-none placeholder:text-white/25 md:text-lg" />
          <div className="mt-3 flex flex-col gap-3 border-t border-white/10 pt-3 sm:flex-row sm:items-center sm:justify-between"><span className="text-xs text-white/30">Ctrl + Enter pour générer</span><button onClick={generate} disabled={!prompt.trim() || generating} className="rounded-xl bg-[#1769ff] px-6 py-3 font-semibold shadow-[0_8px_30px_rgba(23,105,255,.25)] transition hover:bg-[#2875ff] disabled:cursor-not-allowed disabled:opacity-40">{generating ? 'Generation...' : 'Generate project →'}</button></div>
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-4xl flex-wrap justify-center gap-2">{starterPrompts.map((item) => <button key={item} onClick={() => setPrompt(item)} className="rounded-full border border-white/10 bg-white/[.025] px-3 py-2 text-xs text-white/45 transition hover:border-white/20 hover:text-white/75">{item.length > 70 ? item.slice(0, 70) + '…' : item}</button>)}</div>
    </section>

    <section id="workspace" className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
      <div className="mb-5 flex items-end justify-between"><div><p className="mb-2 text-xs font-semibold uppercase tracking-[.18em] text-[#6f9dff]">Workspace</p><h2 className="text-3xl font-bold tracking-tight">Your generated project</h2></div>{project && <button onClick={downloadProject} className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 sm:block">Download .zip</button>}</div>
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0a101b] shadow-[0_30px_100px_rgba(0,0,0,.3)]">
        <div className="flex flex-col border-b border-white/10 md:flex-row md:items-center md:justify-between"><div className="flex overflow-x-auto">{(['preview','code'] as const).map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`border-b-2 px-6 py-4 text-sm font-semibold ${activeTab === tab ? 'border-[#3e83ff] text-white' : 'border-transparent text-white/35'}`}>{tab === 'preview' ? 'Live Preview' : 'Code'}</button>)}</div>{project && <div className="px-5 py-3 text-xs text-white/35">{project.name} • {project.files.length} files</div>}</div>
        {!project ? <div className="grid min-h-[470px] place-items-center px-6 text-center"><div><div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/5 text-2xl">✦</div><h3 className="text-xl font-semibold">Your project will appear here</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">Write an idea above and generate it. You will get a live website preview, editable files and a downloadable ZIP.</p></div></div> : activeTab === 'preview' ? <div className="p-3"><iframe title="Generated project preview" srcDoc={project.html} className="h-[650px] w-full rounded-2xl border border-white/10 bg-white" sandbox="allow-scripts" /></div> : <div className="grid min-h-[560px] md:grid-cols-[230px_1fr]"><aside className="border-r border-white/10 p-3">{project.files.map(file => <button key={file.name} onClick={() => setActiveFile(file.name)} className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm ${activeFile === file.name ? 'bg-[#1769ff]/15 text-white' : 'text-white/45 hover:bg-white/5 hover:text-white'}`}><span>{file.name}</span><span className="text-[9px] uppercase text-white/20">{file.language}</span></button>)}</aside><div className="overflow-auto bg-[#060a12] p-5"><pre className="min-w-max text-sm leading-6 text-[#b9c8e5]"><code>{selectedFile?.content}</code></pre></div></div>}
      </div>
    </section>

    <section id="history" className="relative z-10 mx-auto max-w-7xl px-6 pb-24"><div className="rounded-3xl border border-white/10 bg-white/[.025] p-6"><p className="text-xs font-semibold uppercase tracking-[.18em] text-white/30">Recent prompts</p><div className="mt-4 space-y-2">{history.length ? history.map((item, i) => <button key={i} onClick={() => setPrompt(item)} className="block w-full rounded-xl border border-white/5 bg-white/[.02] p-3 text-left text-sm text-white/55 transition hover:bg-white/5 hover:text-white">{item}</button>) : <p className="py-5 text-sm text-white/25">No generated project yet.</p>}</div></div></section>

    <footer className="relative z-10 border-t border-white/10 px-6 py-10 text-center text-sm text-white/25">CreateAI Studio · Build ideas into editable projects</footer>
  </main>
}

export default Home
