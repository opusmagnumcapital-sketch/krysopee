/* Le Miroir des Trois Voies — export PDF texte (pdfmake)
   Remplace exportPdf() de miroir.html. Aucune donnée ne quitte le navigateur.
   Prérequis : dossier fonts/ (Lora-Regular, Bold, Italic, BoldItalic .ttf) à côté de miroir.html.
   Utilise les globales de miroir.html : lastScores, lastReading, AXES, polar, scoreToRadius,
   CX, CY, R, AXIS_PHASE_TEXT, RESOURCES, phaseOf, loadScript. */
(function () {
  const PDFMAKE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js';
  const FONT_DIR = 'fonts/';
  const FONT_FILES = { normal: 'Lora-Regular.ttf', bold: 'Lora-Bold.ttf',
                       italics: 'Lora-Italic.ttf', bolditalics: 'Lora-BoldItalic.ttf' };
  const GOLD = '#8a6a2a', INK = '#211a10', DIM = '#6b5a3a', PANEL = '#faf6ec', LINE = '#e3d6ae';
  let ready = null;

  function toBase64(buf) {
    const b = new Uint8Array(buf); let s = '';
    for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
    return btoa(s);
  }

  function prepare() {
    if (ready) return ready;
    ready = loadScript(PDFMAKE_URL)
      .then(() => Promise.all(Object.values(FONT_FILES).map(f =>
        fetch(FONT_DIR + f).then(r => {
          if (!r.ok) throw new Error('Police introuvable : ' + f);
          return r.arrayBuffer();
        }).then(buf => { pdfMake.vfs = pdfMake.vfs || {}; pdfMake.vfs[f] = toBase64(buf); })
      )))
      .then(() => { pdfMake.fonts = { Lora: FONT_FILES }; });
    ready.catch(() => { ready = null; });   // permet de réessayer après un échec réseau
    return ready;
  }

  const plain = s => String(s).replace(/<[^>]+>/g, '');

  /* "<br><br>" -> paragraphes ; <em> -> italique ; autres balises retirées */
  function htmlToPdf(html, size) {
    return String(html).split(/<br\s*\/?>\s*<br\s*\/?>/i).map(p => ({
      margin: [0, 0, 0, 6], fontSize: size || 10.5,
      text: p.split(/(<em>.*?<\/em>)/g).filter(Boolean).map(s =>
        /^<em>/.test(s) ? { text: plain(s), italics: true } : { text: plain(s) })
    }));
  }

  /* Radar vectoriel sans texte (les libellés sont posés par pdfmake, en Lora) */
  function radarSvg(scores) {
    const f = n => n.toFixed(1);
    let s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="60 50 300 260" width="300" height="260">';
    [14, 21, 27, 32].forEach(b => {
      const pts = AXES.map(a => polar(CX, CY, scoreToRadius(b), a.angle).map(f).join(',')).join(' ');
      s += '<polygon points="' + pts + '" fill="none" stroke="#d9cba3" stroke-width="1"/>';
    });
    AXES.forEach(a => {
      const p = polar(CX, CY, R, a.angle);
      s += '<line x1="' + CX + '" y1="' + CY + '" x2="' + f(p[0]) + '" y2="' + f(p[1]) + '" stroke="#d9cba3" stroke-width="1"/>';
    });
    const v = AXES.map(a => polar(CX, CY, scoreToRadius(scores[a.key]), a.angle));
    s += '<polygon points="' + v.map(p => p.map(f).join(',')).join(' ') + '" fill="#C9A24B" fill-opacity="0.35" stroke="#8a6a2a" stroke-width="1.6"/>';
    v.forEach(p => { s += '<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="4.5" fill="#ffffff" stroke="#8a6a2a" stroke-width="1.5"/>'; });
    return s + '</svg>';
  }

  const label = t => ({ text: t.toUpperCase(), fontSize: 7.5, characterSpacing: 1.4, color: GOLD, margin: [0, 6, 0, 3] });

  /* Encadré insécable : jamais coupé entre deux pages */
  const box = stack => ({
    unbreakable: true, margin: [0, 0, 0, 10],
    table: { widths: ['*'], body: [[{ stack: stack, fillColor: PANEL, margin: [9, 7, 9, 7] }]] },
    layout: { hLineColor: () => LINE, vLineColor: () => LINE }
  });

  function buildDoc() {
    const S = lastScores, Rd = lastReading;
    const axisDefs = [['solar', 'Œuvre Visible'], ['merc', 'Œuvre Comportementale'], ['herm', 'Œuvre Intérieure']];

    const axes = axisDefs.map(d => box([
      { columns: [{ text: d[1], bold: true, fontSize: 11.5 },
                  { text: phaseOf(S[d[0]]) + ' · ' + S[d[0]] + '/32', alignment: 'right', color: GOLD, fontSize: 10 }] },
      { text: AXIS_PHASE_TEXT[d[0]][phaseOf(S[d[0]])], margin: [0, 5, 0, 0] }
    ]));

    const resources = ['solar', 'merc', 'herm'].map(k => {
      const r = RESOURCES[k];
      return box([
        { text: r.title, fontSize: 13.5, bold: true, margin: [0, 0, 0, 2] },
        { text: plain(r.label).toUpperCase(), fontSize: 7.5, characterSpacing: 1.4, color: GOLD, margin: [0, 0, 0, 6] }
      ].concat(
        htmlToPdf(r.text, 10),
        [label(r.exerciseLabel), { text: r.exercise, fontSize: 9.5 },
         label(r.reflectionLabel), { text: r.reflection, fontSize: 9.5, italics: true },
         label('Pour aller plus loin'),
         { ul: r.biblio.map(b => ({ text: htmlToPdf(b, 9)[0].text, color: DIM })), fontSize: 9 }]
      ));
    });

    const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    const body = [
      { text: 'NEMINI TENERI', alignment: 'center', fontSize: 8, characterSpacing: 3, color: GOLD },
      { text: 'Le Miroir des Trois Voies — Synthèse', alignment: 'center', fontSize: 19, bold: true, margin: [0, 5, 0, 2] },
      { text: date, alignment: 'center', fontSize: 8.5, color: DIM, margin: [0, 0, 0, 8] },
      { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#C9A24B' }], margin: [0, 0, 0, 12] },
      { text: 'PHASE DOMINANTE — ' + Rd.dominant.toUpperCase(), alignment: 'center', fontSize: 8, characterSpacing: 1.4, color: DIM, margin: [0, 0, 0, 8] },
      { unbreakable: true, margin: [0, 0, 0, 14], stack: [
        { text: 'Visible', alignment: 'center', fontSize: 10.5, color: DIM },
        { svg: radarSvg(S), width: 290, alignment: 'center', margin: [0, 2, 0, 2] },
        { columns: [{ text: 'Intérieure', alignment: 'left', fontSize: 10.5, color: DIM, margin: [70, 0, 0, 0] },
                    { text: 'Comportementale', alignment: 'right', fontSize: 10.5, color: DIM, margin: [0, 0, 70, 0] }] }
      ] }
    ].concat(axes, [
      box([label('Lecture croisée'), { text: Rd.text, fontSize: 11, lineHeight: 1.3 }]),
      box([label('Piste suggérée'), { text: Rd.piste, italics: true, color: DIM }])
    ]);
    if (Rd.outro) body.push(box([{ text: plain(Rd.outro), fontSize: 9.5, color: DIM }]));
    body.push(
      { text: 'RESSOURCES — LES TROIS VOIES', fontSize: 8, characterSpacing: 1.6, color: GOLD, margin: [0, 0, 0, 8], pageBreak: 'before' }
    );
    resources.forEach(r => body.push(r));
    body.push({ text: "Ce miroir n'établit aucun verdict. C'est une photographie de vos réponses à un instant donné — pas un diagnostic, pas une prédiction sur ce que vous êtes ou deviendrez.",
                italics: true, fontSize: 9, color: DIM, alignment: 'center', margin: [20, 6, 20, 0] });

    return {
      info: { title: 'Le Miroir des Trois Voies — Synthèse', author: 'Krysopée' },
      pageSize: 'A4', pageMargins: [40, 46, 40, 54],
      defaultStyle: { font: 'Lora', fontSize: 10.5, color: INK, lineHeight: 1.25 },
      footer: (cur, total) => ({ text: 'Krysopée · Nemini Teneri — ' + cur + ' / ' + total,
                                 alignment: 'center', fontSize: 8, color: DIM, margin: [0, 18, 0, 0] }),
      content: body
    };
  }

  window.buildMiroirDoc = buildDoc;

  /* Remplace la fonction exportPdf() historique (même nom, appelée par le bouton) */
  window.exportPdf = function () {
    const btn = document.getElementById('btnExportPdf');
    const original = btn ? btn.textContent : null;
    if (btn) { btn.disabled = true; btn.textContent = 'Préparation du PDF…'; }
    prepare().then(() => {
      const phase = (lastReading && lastReading.dominant ? lastReading.dominant : 'resultat')
        .toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      pdfMake.createPdf(buildDoc()).download('miroir-des-trois-voies-' + phase + '.pdf');
    }).catch(err => {
      console.error('Export PDF impossible :', err);
      alert("Le téléchargement du PDF a échoué (" + ((err && err.message) || err) +
            "). Vous pouvez réessayer, ou utiliser l'impression du navigateur (Ctrl/Cmd+P).");
    }).finally(() => { if (btn) { btn.disabled = false; btn.textContent = original; } });
  };
})();
