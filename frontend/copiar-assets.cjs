const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '..', 'imgs_para_front', 'fundo.png');
const dest = path.resolve(__dirname, 'src', 'assets', 'fundo.png');

if (!fs.existsSync(src)) {
  console.error('❌ Arquivo não encontrado:', src);
  process.exit(1);
}

fs.copyFileSync(src, dest);
console.log('✅ fundo.png copiado para src/assets/fundo.png com sucesso!');
console.log('   Agora reinicie o servidor: npm run dev');
