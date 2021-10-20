import React, { Component } from 'react';
import GuessBox from './components/GuessBox'
import {Container, Row, Col} from 'react-bootstrap';
import './App.css';

class App extends Component {
  render() {
    return (
    <Container fluid>
      <Row>
    <Col/>
    <Col xs={6}>
    <GuessBox/>
    </Col>
    <Col/>
        </Row>
      </Container>
    );
  }
}

export default App;
