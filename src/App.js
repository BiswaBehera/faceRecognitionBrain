import React, { Component } from 'react'
import Particles from "react-particles-js";
import Clarifai from 'clarifai';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import  Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";

const faceApi = new Clarifai.App({
  apiKey: "351429b76e304531aef5b3c6f896f311"
});

const particlejsOptions = {
  particles: {
    number: {
      value: 73,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};

class App extends Component {
	constructor() {
		super();
		this.state = {
			input: '',
			imageUrl: '',
			box: {}
		};
	}

	calculateFaceLocation = (data) => {
		const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
		console.log(clarifaiFace);

		const image = document.getElementById('inputImage');
		const width = Number(image.width);
		const height = Number(image.height);
		
		return {
      		leftCol: width * clarifaiFace.left_col,
      		rightCol: width - width * clarifaiFace.right_col,
      		topRow: height * clarifaiFace.top_row,
      		bottomRow: height - height * clarifaiFace.bottom_row
    	};
	}
	// console.log(response.outputs[0].data.regions[0].region_info.bounding_box)

	onInputChange = (event) => {
		this.setState({input: event.target.value});
	}

	displayFaceBox = (box) => {
		this.setState({box: box});
	}

	onButtonClick = () => {
		this.setState({imageUrl: this.state.input})
		faceApi.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      	.then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      	.catch(err => console.log(err));
	}

  	render() {
		return (
      <div className="tc">
        <Particles className='particle' params={particlejsOptions} />
        <Navigation />
        <Logo />
        <Rank />
		<ImageLinkForm onInputChange={this.onInputChange} onButtonClick={this.onButtonClick}/>
		<FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
      </div>
    );
	}
}

export default App;