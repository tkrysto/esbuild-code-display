
import { useState } from 'react';
import Bundle from '../bundler';
import CodeEditor from './code-editor';
import Preview from './preview';
//import Header from './components/header';

const CodeCell = () => {

    const [code, setCode] = useState('');
    const [input, setInput] = useState('');

    const onClick = async () => {

        const output = await Bundle(input);
        
        setCode(output);
        
    };

    return (
        
        <div>
            <CodeEditor 
            initialValue="const a = 1;" 
            onChange={(value) => setInput(value)}
            />
            <div>
                <button onClick={onClick}>Submit</button>
            </div>
            <Preview code={code} />
        </div>
 );
};

export default CodeCell;