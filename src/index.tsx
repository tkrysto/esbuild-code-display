import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

//import Header from './components/Header';

const App = () => {
    const ref = useRef<any>();
    const iframe = useRef<any>();
    const [input, setInput] = useState('');
    const [code, setCode] = useState('');

    const startService = async () => {
        ref.current = await esbuild.startService({
            wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
            worker: true
        });
    };
    useEffect(() => {
        startService();
    }, []);
    const onClick = async () => {
        if (!ref.current) return;
        
        const result = await ref.current.build({
            entryPoints: ['index.js'],
            bundle: true,
            write: false,
            plugins: [
                unpkgPathPlugin(),
                fetchPlugin(input)
            ],
            define: {
                'process.env.NODE_ENV': '"production"',
                global: 'window'
            }
        });
        //setCode(result.outputFiles[0].text);
        iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
        
    };

    const html = `
        <html>
        <head></head>
        <body>
            <div id="root"></div>
            <script>
                window.addEventListener('message', (event) => {
                    eval(event.data);
                }, false);
            </script>
        </body
        </html>
    `;

    return (
        
        <div>
                <textarea value={input} onChange={e => setInput(e.target.value)}></textarea>
                <div>
                    <button onClick={onClick}>Submit</button>
                </div>
                <pre>{code}</pre>
                <iframe title="iframe" sandbox="allow-scripts" srcDoc={html} ref={iframe}></iframe>
        </div>
 );
};

ReactDOM.render(<App />, document.getElementById("root"));