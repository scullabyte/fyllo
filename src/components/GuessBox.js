import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import {Alert, Button, Form, Col, Row} from 'react-bootstrap';
import GoogleMapReact from 'google-map-react';


//Single todo item component
const GuessBox = (props) => {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

    //Get guesses from todoReducer
    const state = useSelector(state => state)
    const currentCity = useSelector(state => state.currentCity)
    const currentGuessNumber = useSelector(state => state.currentGuessNumber)    
    const [error, setError] = useState(null)
    const [currentGuess, setCurrentGuess] = useState(0)
    const [lat, setLat] = useState(null)
    const [lng, setLon] = useState(null)
    const [temp, setTemp] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [lastGuess, setLastGuess] = useState(null)

    const handleChange = (_i, val)=>{
      if(!!_i?.target?.value) setCurrentGuess(_i.target.value);
    }
    //Use for all the dispatch actions
    const dispatch = useDispatch();
    useEffect(() => {
      if(loaded===false){
        if(state.currentCity===null) {
          dispatch({type: 'SET_CURRENT_CITY'})
        }else{
          getCurrentCityData()
          setLoaded(true);
        }
      }
    }, [state.currentCity, loaded]);

    const getCurrentCityData = async () => {
      try {
        if(state.currentCity!=null){
          const response = await axios.get("https://api.openweathermap.org/data/2.5/weather?q="+state.currentCity+"&appid=9cff733aee57cb05b63dd4f731c46bc4&units=imperial")
          if(!response?.data?.main) throw new Error("Temperature not defined for this city")   
          setTemp(Math.round(response?.data?.main?.temp)) 
          setLat(response?.data?.coord?.lat);
          setLon(response?.data?.coord?.lon);
        }    
      } catch (error) {
          setError(error)
      }
    }

    const guessCity = async () => {
        try {
          if(state.currentCity!=null){ 
            setLastGuess({value: temp, guess: currentGuess, correctGuess: Math.round(temp)===Math.round(currentGuess)});
            dispatch({type: 'REGISTER_GUESS', payload: lastGuess})
            setCurrentGuess(0)
            await Promise.resolve(dispatch({type: 'SET_CURRENT_CITY'}))
            await new Promise((res, rej)=>setTimeout(res(), 1000))
            await getCurrentCityData();
            // Handle finish
          }    
        } catch (error) {
            setError(error)
        }
    }
    return (
    <Form>
      {loaded &&(
      <Row>
      <Col sm="6">
      <h1>Guess the Temperature</h1>
      { error && <Alert variant="danger">{error}</Alert>}
      
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>
        Current Guess: {currentGuessNumber} of 5
          </Form.Label>
        <br/ >
        <Form.Text>
          Guess the temperature in <b>{state.currentCity}</b>:
        </Form.Text>
        <Form.Control size="lg" type="number" placeholder="Your Guess"
          onChange={handleChange}
          value={currentGuess}
        />
        <br />
        <GuessButton isDisabled={currentGuess==0} onNext={guessCity} />
        <br />
        { lastGuess && <Alert style={{marginTop:40}} variant={lastGuess.correctGuess ? "success" : "danger"}>
          <Alert.Heading>Your Last guess was {lastGuess.correctGuess ? 'correct' : 'incorrect'}</Alert.Heading>
          <p>You guessed <b>{lastGuess.guess}°F</b> 
          <br/> the correct temperature was <b>{lastGuess.value}°F</b></p>
          </Alert>}

      </Form.Group>
      </Col>
      {state.currentCity!=null && lat!=null && lng!=null && (
      <Col sm="6">
      <div style={{ height: 500, width: 500, backgroundColor:'red' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo" }}
        defaultCenter={{lat:33,lng:22}}
        center={{lat:lat, lng: lng}}
        defaultZoom={11}
      />
      </div>
      </Col>
      
        )}
        </Row>
      )}
  </Form>
    );
}

export const GuessButton = React.memo(({ onNext, isDisabled=false}) => (
    <Button disabled={isDisabled} variant="primary" onClick={onNext}>Submit Guess</Button>
  ))


export default GuessBox;

