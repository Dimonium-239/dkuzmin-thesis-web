import {Container, Nav, Navbar, Button} from "react-bootstrap";
import axios from "axios";

const URL = 'http://127.0.0.1:5000/';

function solveAll() {
    axios.get(URL + 'solveAllProblems').then()
}


function generateRandom(){
    axios.get(URL + 'getRandom').then();
}

function NavBarComponent() {


    return (
    <Navbar bg="dark" variant="dark">
        <Container>
            <Nav className="me-auto">
                <Nav.Link href="/newBpmn" disabled={true}>New BPMN</Nav.Link>
                <Nav.Link href="/bpmn">BPMN</Nav.Link>
                <Nav.Link href="/dmn">DMN</Nav.Link>
            </Nav>
            <Nav>
                <Button variant="outline-light" onClick={solveAll}>Solve all problems</Button>
                <Button variant="outline-light" onClick={generateRandom}>Get random process</Button>
            </Nav>
        </Container>
    </Navbar>
    )
}

export default NavBarComponent;