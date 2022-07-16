import React from 'react';
import ReactDOM from 'react-dom/client';

class Game extends React.Component {
  render() {
    return (
      <div>
        Welcome to Vacay
      </div>);
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
