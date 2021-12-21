import UploadBpmnComponent from "./upload-bpmn";
import UploadDmnComponent from "./upload-dmn";
import "./styles/styles-all.scss"
import NavBarComponent from "./navbar";
import {Routes, Route} from 'react-router-dom';

function App() {
    return (
        <div className="App">
            <header className="App-header">
            </header>
            <NavBarComponent/>
            <Routes>
                <Route path={'/newBpmn'} element={<></>}/>
                <Route path={'/bpmn'} element={<UploadBpmnComponent/>}/>
                <Route path={'/dmn'} element={<UploadDmnComponent/>}/>
            </Routes>
        </div>
    );
}

export default App;
