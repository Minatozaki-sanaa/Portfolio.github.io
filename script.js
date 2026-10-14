const projects = {
  anta: {
    url: 'https://sea.anta.com/',
    linkType: 'site',
    kicker: '03 / BRAND E-COMMERCE',
    title: '安踏海外独立站建设',
    summary: '参与主站及澳洲、东南亚等 7 国站点建设，推动电商功能在不同市场完成本地化适配。项目预计交付 150+ 个网页及相关数据迁移。',
    time: '2025.12 — 2026.02',
    role: '项目核心成员',
    points: [
      '拆解功能需求，参与插件选型、安装和调试，覆盖支付、物流与营销等电商场景。',
      '跟踪各站点开发进度，进行页面检查与功能测试，协助保障上线质量。',
      '针对 Shopline 原生插件支持不足的问题，协调开发团队和客户 IT 团队推进 CRM 会员系统跨平台接入方案。'
    ]
  },
  filmora: {
    url: 'https://filmora.wondershare.com/',
    linkType: 'site',
    kicker: '02 / GROWTH EXPERIMENT',
    title: 'Filmora 墨西哥商业化增长',
    summary: '围绕墨西哥市场的本地化支付场景，参与营销活动与商业化实验，寻找更适合当地用户的展示和转化方式。',
    time: '2026.04 — 2026.07',
    role: '项目成员',
    points: [
      '配置活动页及站内、客户端资源联动，覆盖 Windows 和 Mac 两端。',
      '推进 VWO A/B Test，完成本地币种支付及分期价格展示方案的实验配置、验收和排查。',
      '结合 GA4 与 UTM 追踪链接，复盘下载率、购买率及跳出率，输出后续优化建议。'
    ]
  },
  holly: {
    url: 'https://www.hollyland.com/',
    linkType: 'site',
    kicker: '04 / CREATOR MARKETING',
    title: 'Hollyland 海外红人营销',
    summary: '统筹中东、欧洲和北美三大区域的红人建联和执行流程，将跨地区的沟通、内容与交付节点串联起来。',
    time: '2025.11 — 2026.01',
    role: '项目负责人',
    points: [
      '通过邮件与社交媒体私信触达 1000+ 位 KOL/KOC，筛选并签约 50+ 位红人。',
      '管理筛选、合同、物流和内容审核，维护日报与周报，并沉淀执行 SOP。',
      '及时应对红人延期与物流延迟等风险，项目最终实现 500 万+ 总曝光。'
    ]
  },
  media: {
    url: 'https://www.media.io/ai-prompts/national-park-poster-prompts.html',
    linkType: 'case',
    kicker: '01 / AI CONTENT SYSTEM',
    title: 'Media.io AI Prompt 内容生产',
    summary: '面向图片生成相关搜索场景，参与搭建 AI Prompt 主题页面的批量生产流程，扩展长尾内容覆盖。',
    time: '2026.07 — 2026.08',
    role: '项目成员',
    points: [
      '参与 n8n + AIGC 工作流落地，基于模板批量生成提示词、图片、文案与 HTML。',
      '负责内容审核、CMS 批量导入与页面上线环节，保障规模化发布质量。',
      '形成程序化 SEO 内容生产流程，缩短单页创建周期并提高内容生产效率。'
    ]
  }
};

const dialog = document.querySelector('#project-dialog');
const toast = document.querySelector('#toast');
let toastTimer;
let activeProject = null;

function renderProject(key) {
    const base = projects[key];
    if (!base) return;
    const project = window.siteLanguage === 'en'
      ? { ...base, ...window.projectTranslations[key] }
      : base;
    document.querySelector('#dialog-kicker').textContent = project.kicker;
    document.querySelector('#dialog-title').textContent = project.title;
    document.querySelector('#dialog-summary').textContent = project.summary;
    document.querySelector('#dialog-time').textContent = project.time;
    document.querySelector('#dialog-role').textContent = project.role;
    const isEnglish = window.siteLanguage === 'en';
    document.querySelector('#dialog-link-label').textContent = base.linkType === 'case'
      ? (isEnglish ? 'LIVE PROJECT PAGE' : '实际项目页面')
      : (isEnglish ? 'BRAND WEBSITE' : '品牌官网');
    const projectLink = document.querySelector('#dialog-project-link');
    projectLink.href = base.url;
    projectLink.textContent = isEnglish ? 'Open website ↗' : '打开网站 ↗';
    const points = document.querySelector('#dialog-points');
    points.replaceChildren(...project.points.map(point => {
      const item = document.createElement('li');
      item.textContent = point;
      return item;
    }));
}

document.querySelectorAll('[data-project]').forEach(card => {
  card.addEventListener('click', () => {
    activeProject = card.dataset.project;
    renderProject(activeProject);
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});
document.querySelectorAll('.project-brand img').forEach(image => {
  image.addEventListener('error', () => { image.style.display = 'none'; });
});
window.addEventListener('site-language-change', () => { if (dialog.open && activeProject) renderProject(activeProject); });

document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

document.querySelector('.copy-wechat').addEventListener('click', async event => {
  try {
    await navigator.clipboard.writeText(event.currentTarget.dataset.copy);
    showToast(window.siteLanguage === 'en' ? 'WeChat ID copied' : '微信号已复制');
  } catch {
    showToast(`${window.siteLanguage === 'en' ? 'WeChat ID' : '微信号'}：${event.currentTarget.dataset.copy}`);
  }
});

const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
window.addEventListener('site-language-change', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-label', window.siteLanguage === 'en' ? (open ? 'Close menu' : 'Open menu') : (open ? '关闭菜单' : '打开菜单'));
});
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', window.siteLanguage === 'en' ? (open ? 'Open menu' : 'Close menu') : (open ? '打开菜单' : '关闭菜单'));
  mobileNav.hidden = open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', window.siteLanguage === 'en' ? 'Open menu' : '打开菜单');
}));

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  const numberObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = 950;
      const start = performance.now();
      const tick = now => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        element.textContent = `${element.dataset.prefix || ''}${Math.round(target * eased).toLocaleString('en-US')}${element.dataset.suffix || ''}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      numberObserver.unobserve(element);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(element => numberObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.desktop-nav a')];
const sectionObserver = new IntersectionObserver(entries => {
  const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!active) return;
  navLinks.forEach(link => link.classList.toggle('active', link.hash === `#${active.target.id}`));
}, { rootMargin: '-25% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

let scrollQueued = false;
window.addEventListener('scroll', () => {
  if (scrollQueued) return;
  scrollQueued = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    document.querySelector('#progress-bar').style.width = `${max > 0 ? scrollY / max * 100 : 0}%`;
    scrollQueued = false;
  });
}, { passive: true });

// Repeat whole labels across the ticker, hiding a label whenever an edge would crop it.
(() => {
  const marquee = document.querySelector('.hero-marquee');
  const track = marquee?.querySelector('.marquee-track');
  if (!track) return;

  const phrases = ['OVERSEAS OPERATIONS', 'CROSS-BORDER COMMERCE', 'WEBSITE GROWTH'];
  let edgeObserver;
  let lastWidth = 0;

  const build = () => {
    const width = marquee.clientWidth;
    if (Math.abs(width - lastWidth) < 16) return;
    lastWidth = width;
    edgeObserver?.disconnect();
    track.style.animation = 'none';

    const run = document.createElement('div');
    run.className = 'marquee-run';
    track.replaceChildren(run);
    let cycles = 0;
    do {
      phrases.forEach(phrase => {
        const item = document.createElement('div');
        item.className = 'marquee-item';
        item.append(document.createTextNode(phrase));
        const star = document.createElement('b');
        star.textContent = '✳';
        item.append(star);
        run.append(item);
      });
      cycles += 1;
    } while (run.scrollWidth < width + 400 && cycles < 12);
    track.append(run.cloneNode(true));

    if ('IntersectionObserver' in window) {
      edgeObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('marquee-visible', entry.intersectionRatio >= .999);
        });
      }, { root: marquee, rootMargin: '0px -3px', threshold: [0, 1] });
      track.querySelectorAll('.marquee-item').forEach(item => edgeObserver.observe(item));
      marquee.classList.add('marquee-observed');
    }

    // Restart at the beginning so both identical runs meet without a jump.
    void track.offsetWidth;
    track.style.removeProperty('animation');
  };

  build();
  if ('ResizeObserver' in window) new ResizeObserver(build).observe(marquee);
  else window.addEventListener('resize', build, { passive: true });
})();
