import {mkdir,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const name of ['index.html','styles.css','motion.css','app.js','celestial.js','transitions.js','motion.js','sources'])await cp(name,'dist/'+name,{recursive:true});
console.log('Presentación estática preparada en dist');
