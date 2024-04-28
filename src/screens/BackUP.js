import React, { useState } from 'react'
const TestScreen = () => {
  const [numVideos, setNumVideos] = useState(1)
  //max: 24
  let videoHeight;
  let videoWidth;

if (numVideos === 1) {
    videoHeight = '90%';
    videoWidth = '60%'
} else if (numVideos === 2) {
    videoHeight = '70%';
    videoWidth = '40%'
} else if (numVideos >= 3 && numVideos <= 6) {
    videoHeight = '40%';
    videoWidth = '28%'
} else if (numVideos === 7 || numVideos === 8) {
    videoHeight = '35%';
    videoWidth = '22%'
} else if (numVideos === 9 || numVideos === 10) {
    videoHeight = '28%';
    videoWidth = '18%'
} else {
    videoHeight = `100/${numVideos}%`;
    videoWidth = `200/${numVideos}%`
}
  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '2fr 12fr'
      }}
    >
      <div style={{
        backgroundColor: 'red'
      }}>
        <strong>Danh sách</strong>
        <div>Quân</div>
        <div>Trân</div>
        <input type="number" onChange={e => setNumVideos(parseInt(e.target.value))}></input>
      </div>
      <div style={{
        backgroundColor: 'blue'
      }}>
        <div
          style={{
            height: '60vh',
            border: 'solid 1px red',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around', 
            alignItems: 'center' 
          }}
        >
          {[...Array(numVideos)].map((index, item) => {
              return (
                <video key={index} height={videoHeight} width={videoWidth} controls />
              )
            }
          )}
        </div>
        <div style={{
          height: '10vh'
        }}>

        </div>
        <div
          style={{
            height: '30vh',
            border: 'solid 1px red',
            textAlign: 'center'
          }}
        >
          <video height="60%" controls />
        </div>
      </div>
    </div>
  )
}

export default TestScreen
