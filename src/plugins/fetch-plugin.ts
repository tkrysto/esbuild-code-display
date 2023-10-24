import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
    name: 'fileCache'
});



export const fetchPlugin = (inputCode: string) => {
    return {
        name: 'fetch-plugin',
        setup(build: esbuild.PluginBuild) {
          build.onLoad({ filter: /.*/ }, async (args: any) => {
            console.log('onLoad', args);
     
            if (args.path === 'index.js') {
              return {
                loader: 'jsx',
                contents: inputCode,
              };
            } 
    
            const cachedResults = await fileCache.getItem<esbuild.OnLoadResult>(args.path);
    
            if (cachedResults) {
                return cachedResults;
            }
    
            const { data, request } = await axios.get(args.path);
            const loader = args.path.endsWith('.css') ? 'css' : 'jsx';
            
            const result: esbuild.OnLoadResult = {
                loader: loader,
                contents: data,
                resolveDir: new URL('./', request.responseURL).pathname,
            };
    
            await fileCache.setItem(args.path, result);
    
            return result;
    
          });
        }
    }
}