/**
 * Drive Tonight cue, board, lineup, and light menu from content JSON.
 */
import { getTonight } from './programme.js'

async function loadJson(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to load ${path}`)
  return res.json()
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function parseDays(days) {
  if (Array.isArray(days)) {
    return days.map(Number).filter((n) => !Number.isNaN(n))
  }
  if (typeof days === 'string') {
    return days
      .split(',')
      .map((part) => Number(part.trim()))
      .filter((n) => !Number.isNaN(n))
  }
  return []
}

function renderBoard(board, day) {
  const grid = document.querySelector('[data-board-grid]')
  if (!grid || !Array.isArray(board)) return

  grid.innerHTML = board
    .map((card) => {
      const days = parseDays(card.days)
      const isToday = days.includes(day)
      const menuTab = card.menuTab ? ` data-menu-tab="${escapeHtml(card.menuTab)}"` : ''
      return `<a class="board__card${isToday ? ' is-today' : ''}" href="${escapeHtml(card.href || '#music')}" data-board-days="${days.join(',')}"${menuTab}>
            <span class="board__label">${escapeHtml(card.label || '')}</span>
            <strong>${escapeHtml(card.title || '')}</strong>
            <span>${escapeHtml(card.detail || '')}</span>
          </a>`
    })
    .join('')
}

function renderLineup(lineup, day, programme) {
  const list = document.querySelector('[data-lineup]')
  if (!list) return

  const rows = Array.isArray(lineup)
    ? lineup.filter((row) => row.kind === 'music')
    : []

  list.innerHTML = rows
    .map((row) => {
      const isToday = Number(row.day) === day
      return `<li class="${isToday ? 'is-today' : ''}" data-lineup-day="${Number(row.day)}">
            <span>${escapeHtml(row.dayLabel || '')}</span>
            <strong>${escapeHtml(row.name || '')}</strong>
            <em>${escapeHtml(row.time || '')}</em>
          </li>`
    })
    .join('')

  const note = document.querySelector('[data-programme-note]')
  if (note && programme?.note) {
    note.innerHTML = `${escapeHtml(programme.note)} —
          <a href="#" target="_blank" rel="noreferrer">check Instagram</a>
          · Enquiries
          <a href="mailto:hello@theemerald.example">hello@theemerald.example</a>`
  }

  const title = document.querySelector('[data-programme-title]')
  if (title && programme?.title) title.textContent = programme.title
  const eyebrow = document.querySelector('[data-programme-eyebrow]')
  if (eyebrow && programme?.eyebrow) eyebrow.textContent = programme.eyebrow
}

function renderLightMenu(menu) {
  const mount = document.querySelector('[data-light-menu]')
  if (!mount || !menu) return

  const sections = Array.isArray(menu.sections) ? menu.sections : []
  const fee = menu.feeNote
    ? `<p class="menu-note">${escapeHtml(menu.feeNote)}</p>`
    : ''

  mount.innerHTML = `
    <div class="menus__intro">
      <p class="eyebrow">${escapeHtml(menu.eyebrow || 'Favourites')}</p>
      <h2>${escapeHtml(menu.title || 'From the kitchen')}</h2>
      <p class="lede">${escapeHtml(menu.intro || '')}</p>
      ${fee}
    </div>
    <div class="menu-columns light-menu">
      ${sections
        .map(
          (section) => `
        <div class="menu-block" id="light-${escapeHtml(section.id || '')}">
          <h3>${escapeHtml(section.name || '')}</h3>
          <ul class="menu-list">
            ${(section.items || [])
              .map(
                (item) => `
              <li>
                <div class="menu-item">
                  <strong>${escapeHtml(item.name || '')}</strong>
                  <span class="price">${escapeHtml(item.price || '')}</span>
                </div>
                ${item.description ? `<span>${escapeHtml(item.description)}</span>` : ''}
              </li>`,
              )
              .join('')}
          </ul>
        </div>`,
        )
        .join('')}
    </div>`
}

function applyGiftCards(venue) {
  const url = venue?.giftCards?.url
  const label = venue?.giftCards?.label || 'Gift cards'
  if (!url) return

  document.querySelectorAll('[data-gift-card]').forEach((el) => {
    el.href = url
    if (el.dataset.giftCard === 'label') el.textContent = label
  })
}

function applyTonight(tonight) {
  document.querySelectorAll('[data-tonight-label]').forEach((el) => {
    el.textContent = tonight.label
  })
  document.querySelectorAll('[data-tonight-line]').forEach((el) => {
    el.textContent = tonight.short
  })
  document.querySelectorAll('[data-tonight-detail]').forEach((el) => {
    el.textContent = tonight.detail
  })
  const cue = document.getElementById('tonight-cue')
  if (cue && tonight.href) cue.setAttribute('href', tonight.href)
}

function wireChrome() {
  const header = document.getElementById('site-header')
  const hero = document.getElementById('top')
  if (header && hero && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      ([e]) =>
        header.classList.toggle(
          'is-scrolled',
          !(e.isIntersecting && e.intersectionRatio > 0.35),
        ),
      { threshold: [0, 0.35, 1] },
    )
    io.observe(hero)
  }

  const toggle = document.querySelector('.nav-toggle')
  const nav = document.getElementById('site-nav')
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open')
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
    })
    nav.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        nav.classList.remove('is-open')
        toggle.setAttribute('aria-expanded', 'false')
      }),
    )
  }

  const menuTabs = document.querySelectorAll('.menu-services button')
  const menuPanels = document.querySelectorAll('.menu-panel')
  menuTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.menu
      menuTabs.forEach((b) => {
        b.classList.toggle('is-active', b === btn)
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false')
      })
      menuPanels.forEach((panel) => {
        const on = panel.dataset.panel === id
        panel.classList.toggle('is-active', on)
        panel.hidden = !on
      })
    })
  })

  document.body.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-menu-tab]')
    if (!tab) return
    const id = tab.getAttribute('data-menu-tab')
    const btn = document.querySelector(`.menu-services button[data-menu="${id}"]`)
    if (btn) btn.click()
  })
}

async function boot() {
  wireChrome()

  const [programme, menu, venue] = await Promise.all([
    loadJson('./content/programme.json'),
    loadJson('./content/menu.json'),
    loadJson('./content/venue.json'),
  ])

  const tonight = getTonight(programme)
  applyTonight(tonight)
  renderBoard(programme.board, tonight.day)
  renderLineup(programme.lineup, tonight.day, programme)
  renderLightMenu(menu)
  applyGiftCards(venue)
}

boot().catch((err) => {
  console.error(err)
})
