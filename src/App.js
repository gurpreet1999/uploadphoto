import React, { useRef } from 'react'
import "./App.css"
import { generateDownload } from './Utils';
import Cropper from "react-easy-crop";
import { waitFor } from '@testing-library/react';

const App = () => {
	const canvas = document.createElement("canvas")

	const canvasCtx = canvas.getContext("2d");

let activeImage, originalWidthToHeightRatio;

  const inputRef =useRef();

	const triggerFileSelectPopup = () => inputRef.current.click();
  const [image, setImage] = React.useState(null);
	const [croppedArea, setCroppedArea] = React.useState(null);
	const [crop, setCrop] = React.useState({ x: 0, y: 0 });
	const [zoom, setZoom] = React.useState(1);


	const resize=(width,height)=>{
		canvas.width = Math.floor(width);
		canvas.height = Math.floor(height);

		// canvasCtx.drawImage(activeImage, (canvas.width-activeImage.width)/2, (canvas.height-activeImage.height)/2,Math.floor(width),Math.floor(height));
		
		canvasCtx.drawImage(activeImage, 0, 0, Math.floor(width),Math.floor(height));
		const imageUrl= canvas.toDataURL("image/jpeg",0.5);
		setImage(imageUrl)
	}

const openImage=(imageSrc)=>{
	activeImage = new Image();

	activeImage.addEventListener("load", () => {
		originalWidthToHeightRatio = activeImage.width / activeImage.height;

 let imageWidth=activeImage.width;
 let imageHeight=activeImage.height;

 if(imageWidth<538){


	const height=538/originalWidthToHeightRatio
	console.log("REACHhERE",height)
	console.log(imageWidth)


	resize(538,height);
	return;

 }
else if(imageHeight<538){
  const width=538*originalWidthToHeightRatio
  if(width<538){
	resize(538,538)
  }
	resize(width,538)
	return;

}

 else{
const width=538*originalWidthToHeightRatio
if(width<538){
	resize(538,538);
}

	resize(width,538);
	return;

 }
 
		})
	activeImage.src = imageSrc;
}



  const onSelectFile = (event) => {
		if (event.target.files && event.target.files.length > 0) {

      console.log(event.target.files[0])

			const reader = new FileReader();
			reader.readAsDataURL(event.target.files[0]);
			reader.addEventListener("load", () => {
				openImage(reader.result);
				
			});
		}
	};
  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
		setCroppedArea(croppedAreaPixels);
	};

  const onDownload = () => {
		generateDownload(image, croppedArea);
	};


  return (
    <div className="darkBg">
    <div className="centered">
      <div className="modal">
        
      <Cropper 
	  style={{mediaStyle:{
		maxHeight:"none",
		maxWidth:"none",
		position:"static",
		margin:"0",
		
	  },
	}}

// cropSize={{width:'538px', height: '538px'}}
								image={image}
								crop={crop}
								zoom={zoom}
								aspect={1}
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
							/>
</div>
      
      </div>
   

    <input
					type='file'
					accept='image/*'
					ref={inputRef}
					onChange={onSelectFile}
					style={{ display: "none" }}
				/>
    <button onClick={triggerFileSelectPopup}   className='chooseBtn'>choose</button>
  </div>
  )
}

export default App