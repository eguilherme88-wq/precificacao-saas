// Copia o app web (pasta raiz do repositório) para desktop/app, que vai dentro do instalador.
const fs = require('fs'), path = require('path');
const raiz = path.join(__dirname, '..'), destino = path.join(__dirname, 'app');
fs.rmSync(destino, { recursive: true, force: true });
fs.mkdirSync(destino, { recursive: true });
for (const item of ['index.html', 'manifest.webmanifest', 'icons']) {
  fs.cpSync(path.join(raiz, item), path.join(destino, item), { recursive: true });
}
console.log('App copiado para', destino);
