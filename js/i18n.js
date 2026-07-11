/**
 * I18n - 한/영 다국어 런타임 (경량판)
 *  - AI 플랫폼 사이트용. index.html의 한글이 단일 소스, 표시할 때만 영어로 치환.
 *  - SIF 프로그램(sif_Program/js/i18n.js)의 런타임을 이식하되, 데이터(DB/범주값/서술문)가
 *    없는 정적 사이트이므로 UI 문구 사전(t) + DOM 자동치환(translateDOM)만 남겼다.
 *  - t(ko)     : UI 문구 (한글 원문을 키로 사용)
 *  - cases(n)  : "N건" / "N cases"
 * 언어 전환은 localStorage 저장 후 새로고침. (SIF와 키를 분리: 'platform-lang')
 */
const I18n = {
  lang: (typeof localStorage !== 'undefined' && localStorage.getItem('platform-lang')) || 'ko',
  _ui: {},
  _loaded: false,
  ready: null,

  init() {
    if (this.ready) return this.ready;
    if (this.lang !== 'en') {
      this.ready = Promise.resolve();
      return this.ready;
    }
    const load = (p) => fetch(p).then(r => (r.ok ? r.json() : {})).catch(() => ({}));
    this.ready = load('./data/i18n/ui_en.json').then((ui) => {
      this._ui = ui || {};
      this._loaded = true;
      this._flat = null; // 리소스 로드 완료 → 평면 사전 재생성 강제
      // 브라우저 탭 제목 번역
      try {
        const tt = (document.title || '').trim();
        if (this._ui[tt]) document.title = this._ui[tt];
      } catch (e) { /* 무시 */ }
      // 접근성/SEO: EN이면 <html lang> 전환
      try { document.documentElement.setAttribute('lang', 'en'); } catch (e) { /* 무시 */ }
    });
    return this.ready;
  },

  get isEn() { return this.lang === 'en'; },

  /** UI 문구: 한글 원문(ko)을 키이자 fallback으로 사용 */
  t(ko) {
    if (this.lang !== 'en') return ko;
    return (this._ui[ko] != null && this._ui[ko] !== '') ? this._ui[ko] : ko;
  },

  /** "123건" / "123 cases" */
  cases(n) {
    return this.lang === 'en' ? `${n} cases` : `${n}건`;
  },

  setLang(lang) {
    if (lang !== 'ko' && lang !== 'en') return;
    localStorage.setItem('platform-lang', lang);
    window.location.reload();
  },

  /* ── DOM 텍스트 일괄 치환 (정적 HTML용) ──
     _ui 사전으로 텍스트 노드의 한글 원문을 영어로 바꾼다. 여러 번 호출해도 안전. */
  _flat: null,

  _buildFlat() {
    if (this._flat) return this._flat;
    this._flat = Object.assign({}, this._ui);
    return this._flat;
  },

  translateDOM(root) {
    if (this.lang !== 'en' || !this._loaded) return;
    const dict = this._buildFlat();
    const el = root || document.body;
    if (!el) return;
    const SKIP = { SCRIPT: 1, STYLE: 1, CANVAS: 1, NOSCRIPT: 1 };
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (SKIP[node.parentNode && node.parentNode.nodeName]) return NodeFilter.FILTER_REJECT;
        return node.nodeValue && node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);
    for (const node of nodes) {
      const raw = node.nodeValue;
      const key = raw.trim();
      let en = dict[key];
      // 화살표/기호 접미가 붙은 라벨("Guidde에서 보기 →") 대응
      if (en == null) {
        const m = key.match(/^(.*\S)\s*([▼▲▾▸►◀☰⌄→←↗]+)$/);
        if (m && dict[m[1]] != null) { node.nodeValue = raw.replace(key, dict[m[1]] + ' ' + m[2]); continue; }
      }
      if (en != null && en !== key) {
        node.nodeValue = raw.replace(key, en);
      } else {
        const conv = this._numUnits(raw);
        if (conv !== raw) node.nodeValue = conv;
      }
    }

    // data-en 요소: 내부 서식(<strong>,<br>)이 있어 텍스트노드 매칭이 어려운 산문은
    // 요소 단위로 innerHTML을 통째 교체 (한국어 원본은 data-ko에 보존해 복원 가능)
    el.querySelectorAll('[data-en]').forEach((node) => {
      const en = node.getAttribute('data-en');
      if (en == null) return;
      if (node.getAttribute('data-ko') == null) node.setAttribute('data-ko', node.innerHTML);
      if (node.innerHTML !== en) node.innerHTML = en;
    });

    // placeholder / title / alt / content(meta) 속성 치환
    el.querySelectorAll('[placeholder]').forEach((inp) => {
      const p = inp.getAttribute('placeholder');
      if (p && dict[p.trim()] != null) inp.setAttribute('placeholder', dict[p.trim()]);
    });
    el.querySelectorAll('[title]').forEach((nd) => {
      const p = nd.getAttribute('title');
      if (!p) return;
      const k = p.trim();
      if (dict[k] != null) nd.setAttribute('title', dict[k]);
    });
    el.querySelectorAll('img[alt]').forEach((nd) => {
      const p = nd.getAttribute('alt');
      if (p && dict[p.trim()] != null) nd.setAttribute('alt', dict[p.trim()]);
    });
  },

  /** 숫자+단위 표기 변환: "2,574건"→"2,574 cases", "58개"→"58", "3위"→"#3" */
  _numUnits(raw) {
    if (!/[건개위]/.test(raw)) return raw;
    return raw
      .replace(/(\d[\d,]*)\s*건/g, '$1 cases')
      .replace(/(\d[\d,]*)\s*개/g, '$1')
      .replace(/(\d+)\s*위/g, '#$1');
  },

  /** EN이면 body 전체 재치환 (렌더 후 호출) */
  refresh() { this.translateDOM(document.body); },

  /* ── 자동 번역: 동적으로 추가되는 DOM을 감지해 재치환 ── */
  _observer: null,
  _translating: false,
  _raf: 0,

  installAutoTranslate() {
    if (this.lang !== 'en' || this._observer || typeof MutationObserver === 'undefined') return;
    if (!document.body) return;
    const obs = new MutationObserver((muts) => {
      if (this._translating) return;
      for (const m of muts) {
        if (m.addedNodes.length || m.type === 'characterData') { this._schedule(); break; }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    this._observer = obs;
  },

  _schedule() {
    if (this._raf) return;
    this._raf = requestAnimationFrame(() => {
      this._raf = 0;
      this._translating = true;
      try { this.translateDOM(document.body); } finally { this._translating = false; }
    });
  },
};

// 즉시 로드 시작(EN일 때 리소스 프리페치)
I18n.init();
