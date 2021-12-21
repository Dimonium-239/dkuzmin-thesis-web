import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import { createBrowserHistory } from "history";


const history = createBrowserHistory();

ReactDOM.render(
    <BrowserRouter history={history}>
        <React.StrictMode>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
                  integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
                  crossOrigin="anonymous"/>
            <App/>
        </React.StrictMode>
    </BrowserRouter>,
    document.getElementById('root')
);

