// Transcribe archivos WAV con Whisper (base, multilingüe) en local, para verificar la narración.
//   node asr.mjs --lista lote.json      (lote.json = ["a.wav", "b.wav", ...])
// Escribe por la salida estándar un JSON { ruta: transcripción }.
import { pipeline, env } from '@huggingface/transformers';
import wavefile from 'wavefile';
import fs from 'fs';

env.allowRemoteModels = false;
env.localModelPath = process.env.ASR_MODELS || './modelos/';
const i = process.argv.indexOf('--lista');
const archivos = i >= 0 ? JSON.parse(fs.readFileSync(process.argv[i + 1], 'utf8')) : process.argv.slice(2);
const asr = await pipeline('automatic-speech-recognition', 'Xenova/whisper-base', { dtype: 'q8' });
const salida = {};
for (const f of archivos) {
  const wav = new wavefile.WaveFile(fs.readFileSync(f));
  wav.toBitDepth('32f');
  wav.toSampleRate(16000);
  let s = wav.getSamples();
  if (Array.isArray(s)) s = s[0];
  const r = await asr(new Float32Array(s), { language: 'spanish', task: 'transcribe', chunk_length_s: 30 });
  salida[f] = r.text.trim();
}
console.log(JSON.stringify(salida));
