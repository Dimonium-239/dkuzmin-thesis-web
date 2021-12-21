import React, {Component} from "react";
import axios from "axios";
import {Button, Dropdown, DropdownButton} from "react-bootstrap";
import XMLViewer from "react-xml-viewer";
import { migrateDiagram } from '@bpmn-io/dmn-migrate';

import DmnJS from "dmn-js/lib/Modeler";

import camundaModdleDescriptor from "camunda-dmn-moddle/resources/camunda";

import propertiesPanelModule from "dmn-js-properties-panel";
import propertiesProviderModule from "dmn-js-properties-panel/lib/provider/camunda";
import drdAdapterModule from "dmn-js-properties-panel/lib/adapter/drd";
import "dmn-js-properties-panel/dist/assets/dmn-js-properties-panel.css";

import "dmn-js/dist/assets/diagram-js.css";
import "dmn-js/dist/assets/dmn-font/css/dmn-embedded.css";
import "dmn-js/dist/assets/dmn-js-decision-table-controls.css";
import "dmn-js/dist/assets/dmn-js-decision-table.css";
import "dmn-js/dist/assets/dmn-js-drd.css";
import "dmn-js/dist/assets/dmn-js-literal-expression.css";
import "dmn-js/dist/assets/dmn-js-shared.css";


const URL = 'http://127.0.0.1:5000/';

// this.viewer.on("views.changed", ({activeView}) => {
//     const propertiesPanel = this.viewer.getActiveViewer().get("propertiesPanel", false);
//
//     if (propertiesPanel) {
//         propertiesPanel.detach();
//
//         if (activeView.type === "drd") {
//             propertiesPanel.attachTo(
//                 document.getElementById("properties-panel-container")
//             );
//         }
//     }
// });

class UploadDmnComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dmnFile: '',
            layoutFile: '',
            listOfDiagrams: [],
            solutionName: '',
            showXML: false
        };
        //TODO: https://codesandbox.io/examples/package/dmn-js
        const container = document.getElementById("container");
        this.viewer = new DmnJS({
            container,
            width: "100%",
            height: "100%",
            position: "absolute",
            decisionTable: {
                keyboard: {
                    bindTo: document
                }
            },
            moddleExtensions: {
                camunda: camundaModdleDescriptor
            },
            drd: {
                additionalModules: [
                    propertiesPanelModule,
                    propertiesProviderModule,
                    drdAdapterModule
                ]
            }
        })
        this.generateId = 'dmnContainer'+ Date.now();
    }


    componentDidMount() {
        this.getListOfDMN();
    }

    async importXML() {
        const dmnFile = await migrateDiagram(this.state.dmnFile);
        await this.viewer.importXML(dmnFile);
        try {
            let canvas = this.viewer.get('canvas');
            canvas.zoom('fit-viewport');
        } catch (e) {

        }

    }

    setSelectedValue(e) {
        this.setState({solutionName: e});
    }

    getListOfDMN(){
        axios.get(URL + 'getListOfDMN')
            .then((res) => this.setState({listOfDiagrams: res.data}))
            .then(()=>{this.state.listOfDiagrams.length > 0 &&
            this.setState({solutionName: this.state.listOfDiagrams[0]})
            })
    }

    getDMN(){
        axios.get(URL + 'getDMN/' + this.state.solutionName)
            .then((res) => {
                this.setState({dmnFile: res.data})
                this.viewer.attachTo('#'+ this.generateId);
            })
            .then(() => {
                migrateDiagram(this.state.dmnFile).then((res) => this.setState({dmnFile: res}));
            })
            .then(()=>{
                this.importXML(this).then();
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
                        <Button onClick={this.getDMN.bind(this)}>Upload</Button>
                        <DropdownButton onSelect={this.setSelectedValue.bind(this)} variant="primary" id="dropdown-basic" title={this.state.solutionName}>
                            {this.state.listOfDiagrams.map((diagram) =>
                                <Dropdown.Item key={diagram} eventKey={diagram}>
                                    <p>{diagram}</p>
                                </Dropdown.Item>
                            )}
                        </DropdownButton>
                        <div className={"xml-diagram"}>
                            <Button onClick={this.toggleXML.bind(this)}>{this.state.showXML ? '^' : 'V'}</Button>
                            {this.state.showXML && <XMLViewer xml={this.state.dmnFile} />}
                        </div>
                    </div>
                </div>
                <div id={this.generateId}/>
            </div>
        )}
}

export default UploadDmnComponent;