import React from 'react';

import './PageGallery.css';

function PageGallery() {
  return (
    <div className="PageGallery RainbowBG">
      <div className="PageGallery-inner">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
            width: '100%',
          }}
        >
          {Array.from(Array(100)).map((val, id) => (
            // eslint-disable-next-line react/no-array-index-key
            <img key={id} style={{ display: 'block', margin: '4px' }} src={`https://d207ap6gpsm7q4.cloudfront.net/images/${id}.png`} alt={`butt #${id}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PageGallery;
