const config                = require('./src/widgetConfig.json');
//import commonjs from 'vite-plugin-commonjs'

export default {
    //target: "es2015",
    build: {
      // plugins: [
      //   commonjs(/* options */),
      // ],
      rollupOptions: {
        input: {
          index: 'src/ts/index.ts',
          [config.types.promo.file]: 'src/ts/promo.ts',
          [config.types.searchBar.file]: 'src/ts/searchBar.ts',
        },
        // output: {
          
        //   entryFileNames: 'js/[name].js',
        // },
        output: {
          // Desactiva la creación de fragmentos manuales
          //manualChunks: false,
          // Incluye las importaciones dinámicas en línea ONLY 1 INPUT
          //inlineDynamicImports: true,
          assetFileNames: (assetInfo) => {
            let extType   = assetInfo.name.split('.').at(-1);
            let nameFile  = assetInfo.name.replace('.'+extType, "");
            if (/css/i.test(extType)) {
              return `${nameFile}/${[config.types[nameFile].file]}[extname]`;
            } 
            // else {
            //   return `assets/${extType}/[name][extname]`;
            // }
          },
          chunkFileNames: 'auxRB.js',
          entryFileNames: (chunkInfo) => { 
            switch(chunkInfo.name){
              case config.types.promo.file:
                return 'promo/[name].js';
              case config.types.searchBar.file:
                return 'searchBar/[name].js';
              default:
                return '[name].js'
            }
            
          },
        },
      },
    },
  };