import 'bulmaswatch/superhero/bulmaswatch.min.css';
import ReactDOM from "react-dom";
import CodeCell from './components/code-cell';
//import Header from './components/header';

const App = () => {

    return (
        
        <div>
           <CodeCell />
        </div>
 );
};

ReactDOM.render(<App />, document.getElementById("root"));