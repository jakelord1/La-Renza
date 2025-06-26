import React from 'react';

const loaderStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(255,255,255,0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const spinnerStyle = {
  width: 48,
  height: 48,
  border: '6px solid #e0e0e0',
  borderTop: '6px solid #6f42c1',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const Loader = ({ style = {}, overlay = true }) => (
  <div style={overlay ? { ...loaderStyle, ...style } : { display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
    <div style={spinnerStyle} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default Loader;
