import './App.css';
import React from 'react';
import PageHome from './components/PageHome';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';

function App() {
  return (
    <div className="App">
      <div className="App-inner">
        <AppHeader />
        <main className="App-main">
          <PageHome />
        </main>
      </div>
      <AppFooter className="App-footer" />
    </div>
  );
}

export default App;
