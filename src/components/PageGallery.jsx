import React from 'react';

import './PageGallery.css';

function PageGallery() {
  return (
    <div className="PageGallery RainbowBG">
      <div className="PageGallery-inner">
        <div
          style={{
            display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '100%',
          }}
        >
          {Array.from(Array(1000)).map((val, id) => (
            <img style={{ display: 'block', margin: '4px' }} src={`https://d207ap6gpsm7q4.cloudfront.net/images/${id}.png`} alt={`butt #${id}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PageGallery;
