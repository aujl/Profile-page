(function () {
  const prefersReducedMotion = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

  function initNav() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const menu = document.getElementById('site-nav');
    if (!toggle || !menu) return;

    const links = menu.querySelectorAll('a');

    function closeMenu() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  }

  function initTypedHeadline() {
    const typedHost = document.querySelector('[data-typed-texts]');
    if (!typedHost) return;

    const textTarget = typedHost.querySelector('.hero__typed-text');
    if (!textTarget) return;

    let texts;
    try {
      texts = JSON.parse(typedHost.getAttribute('data-typed-texts'));
    } catch (error) {
      console.error('Unable to parse typed text data:', error);
      return;
    }

    if (!Array.isArray(texts) || texts.length === 0) {
      return;
    }

    if (prefersReducedMotion) {
      textTarget.textContent = texts[0];
      return;
    }

    let index = 0;
    let character = 0;
    let deleting = false;

    function tick() {
      const current = texts[index];
      character += deleting ? -1 : 1;

      if (!deleting && character === current.length) {
        textTarget.textContent = current;
        setTimeout(() => {
          deleting = true;
          setTimeout(tick, 400);
        }, 1600);
        return;
      }

      if (deleting && character === 0) {
        deleting = false;
        index = (index + 1) % texts.length;
      }

      const nextText = current.slice(0, Math.max(0, character));
      textTarget.textContent = nextText;
      const delay = deleting ? 60 : 90;
      setTimeout(tick, delay);
    }

    // kick off after slight delay for effect
    setTimeout(tick, 500);
  }

  function formatDate(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(date);
  }

  function createRepoCard(repo) {
    const card = document.createElement('article');
    card.className = 'repo-card';

    const description = repo.description ? repo.description.trim() : 'No description provided yet.';
    const updatedAt = formatDate(repo.pushed_at);

    card.innerHTML = `
      <h3><a href="${repo.html_url}" target="_blank" rel="noreferrer">${repo.name}</a></h3>
      <p>${description}</p>
      <dl>
        <div>
          <dt>Primary language</dt>
          <dd>${repo.language || '—'}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>${updatedAt || 'recently'}</dd>
        </div>
        <div>
          <dt>Stars</dt>
          <dd>${repo.stargazers_count}</dd>
        </div>
      </dl>
    `;

    return card;
  }

  async function populateRepositories() {
    const grids = document.querySelectorAll('[data-github-grid]');
    if (!grids.length) return;

    await Promise.all(
      Array.from(grids).map(async (grid) => {
        const user = grid.getAttribute('data-source-user');
        const limit = Number(grid.getAttribute('data-limit') || 6);
        if (!user) return;

        try {
          const response = await fetch(`https://api.github.com/users/${user}/repos?per_page=${limit}&sort=updated`, {
            headers: {
              Accept: 'application/vnd.github+json'
            }
          });

          if (!response.ok) {
            throw new Error(`GitHub API responded with status ${response.status}`);
          }

          const data = await response.json();
          const filtered = data.filter((repo) => !repo.fork && !repo.private && repo.name !== 'Profile-page');
          const selected = filtered.slice(0, limit);

          grid.innerHTML = '';

          if (!selected.length) {
            grid.innerHTML = `<p class="repo-grid__status">No repositories available right now. Visit <a href="https://github.com/${user}" target="_blank" rel="noreferrer">github.com/${user}</a> for more.</p>`;
            return;
          }

          selected.forEach((repo) => {
            grid.appendChild(createRepoCard(repo));
          });
        } catch (error) {
          console.error('Failed to load repositories', error);
          grid.innerHTML = `<p class="repo-grid__status">Unable to load repositories. Visit <a href="https://github.com/${user}" target="_blank" rel="noreferrer">github.com/${user}</a>.</p>`;
        }
      })
    );
  }

  document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initTypedHeadline();
    populateRepositories();
  });
})();
