// Exporta el banco de prácticas como JSON (lo usa verificacion/verificar_practicas.py).
import BANCO from '../contenido/practicas.mjs';
console.log(JSON.stringify(BANCO.map((n) => ({ id: n.id, titulo: n.titulo,
  preguntas: n.preguntas.map((p, k) => ({ k: k + 1, q: p.q.replace(/<[^>]+>/g, ''), nops: p.ops.length, v: p.v || null, tieneSol: !!p.sol, rep: p.rep || '' })) }))));
