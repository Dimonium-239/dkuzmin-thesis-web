import React, { Component } from 'react';
import axios from "axios";
import {Button, DropdownButton, Dropdown} from "react-bootstrap";
import XMLViewer from "react-xml-viewer";

import BpmnJS from "bpmn-js/lib/Modeler";
import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";
import { getMid } from "diagram-js/lib/layout/LayoutUtil";

const URL = 'http://127.0.0.1:5000/';

class UploadBpmnComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bpmnFile: '',
            layoutFile: '',
            listOfDiagrams: [],
            solutionName: '',
            showXML: false
        };
        //TODO: https://codesandbox.io/examples/package/bpmn-js
        const container = document.getElementById("container");
        this.viewer = new BpmnJS({
            container,
            keyboard: {
                bindTo: document
            }
        });
        this.generateId = 'bpmnContainer'+ Date.now();
    }


    componentDidMount() {
        this.getListOfBPMN();
    }

    importXML() {
        const viewer = this.viewer;
        this.viewer.importXML(this.state.bpmnFile, function(err) {
            if (err) {
                return console.error('could not import BPMN 2.0 diagram', err);
            }
            let canvas = viewer.get('canvas')
            canvas.zoom('fit-viewport');
        });
    }

    setSelectedValue(e) {
        this.setState({solutionName: e});
    }

    layoutBPMN(){

        const elementRegistry = this.viewer.get("elementRegistry");
        const modeling = this.viewer.get("modeling");

        const connections2 = elementRegistry.filter((element) => element.waypoints);

        connections2.forEach((connection) => {
        modeling.updateWaypoints(connection, [
            getMid(connection.source),
            getMid(connection.target)
        ]);

        modeling.layoutConnection(connection, {
            connectionStart: getMid(connection.source),
        connectionEnd: getMid(connection.target)
        });
    });
}


    getListOfBPMN(){
        axios.get(URL + 'getListOfDiagrams')
            .then((res) => this.setState({listOfDiagrams: res.data}))
            .then(()=>{this.state.listOfDiagrams.length > 0 &&
                this.setState({solutionName: this.state.listOfDiagrams[0]})
            })
    }



    getBPMN(){
        axios.get(URL + 'getBPMN/' + this.state.solutionName)
            .then((res) => {
                this.setState({bpmnFile: res.data})
                this.viewer.attachTo('#'+ this.generateId);
            })
            .then(()=>{
                this.importXML(this);
            })
    }

    toggleXML(){
        this.setState({showXML: !this.state.showXML})
    }

    render() {
        return(
        <div>
            <div className={'work-space'}>
                <div className={"navigation-panel"}>
                    <Button onClick={this.getBPMN.bind(this)}>Upload</Button>
                    <Button onClick={this.layoutBPMN.bind(this)}>Layout</Button>
                    <DropdownButton onSelect={this.setSelectedValue.bind(this)} variant="primary" id="dropdown-basic" title={this.state.solutionName}>
                        {this.state.listOfDiagrams.map((diagram) =>
                            <Dropdown.Item key={diagram} eventKey={diagram}>
                                <p>{diagram}</p>
                            </Dropdown.Item>
                        )}
                    </DropdownButton>
                    <div className={"xml-diagram"}>
                        <Button onClick={this.toggleXML.bind(this)}>{this.state.showXML ? '^' : 'V'}</Button>
                        {this.state.showXML && <XMLViewer xml={this.state.bpmnFile} />}
                    </div>
                </div>
            </div>
            <div id={this.generateId}/>
        </div>
        )}
}

export default UploadBpmnComponent;
