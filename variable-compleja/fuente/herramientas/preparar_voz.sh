#!/usr/bin/env bash
# Prepara la voz (Supertonic 3, 31 idiomas, licencia OpenRAIL-M de Supertone) y el
# reconocedor (Whisper base) usados para narrar y verificar los videos.
# Ambos se obtienen de paquetes públicos de npm; no se guardan en el repositorio.
#   bash herramientas/preparar_voz.sh [carpeta_de_trabajo]
set -euo pipefail
AQUI="$(cd "$(dirname "$0")" && pwd)"
BUILD="${1:-$AQUI/../build}"
mkdir -p "$BUILD/descargas" "$BUILD/voz_supertonic3" "$BUILD/asr/modelos"
cd "$BUILD/descargas"
npm pack --silent @3sln/donki-lle-voice-multi@0.1.1 @3sln/donki-lle-voice-multi-2@0.1.1 \
  @3sln/donki-lle-voice-multi-3@0.1.1 sts-whisper-base@1.0.0
for n in "" -2 -3; do mkdir -p "vm$n"; tar xzf "3sln-donki-lle-voice-multi$n-0.1.1.tgz" -C "vm$n"; done
python3 - "$BUILD/voz_supertonic3" <<'PY'
import base64, json, os, re, sys
destino = sys.argv[1]
paq = {'@3sln/donki-lle-voice-multi@0.1.1': 'vm/package', '@3sln/donki-lle-voice-multi-2@0.1.1': 'vm-2/package',
       '@3sln/donki-lle-voice-multi-3@0.1.1': 'vm-3/package'}
src = open('vm/package/voice.js').read()
meta = json.loads(src[src.index('{'):src.rindex('}') + 1])
for nombre, info in meta['files'].items():
    datos = b''
    for parte in info['parts']:
        p, rel = parte.split('/c/')
        js = open(os.path.join(paq[p], 'c', rel)).read()
        datos += base64.b64decode(re.match(r'\s*export default "([A-Za-z0-9+/=]*)";?\s*$', js).group(1))
    assert len(datos) == info['size'], nombre
    open(os.path.join(destino, nombre), 'wb').write(datos)
    print('voz:', nombre, len(datos))
PY
tar xzf sts-whisper-base-1.0.0.tgz -C "$BUILD/asr/modelos" --strip-components=2 package/models
cp "$AQUI/asr.mjs" "$BUILD/asr/asr.mjs"
cd "$BUILD/asr"
[ -f package.json ] || npm init -y >/dev/null
ONNXRUNTIME_NODE_INSTALL_CUDA=skip npm install --silent @huggingface/transformers wavefile
pip install -q sherpa-onnx numpy
echo "Listo. Exporta: VC_VOZ=$BUILD/voz_supertonic3  VC_ASR=$BUILD/asr"
