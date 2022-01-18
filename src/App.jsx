import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import PageHome from './components/PageHome';
import PageMint from './components/PageMint';
import PageInfo from './components/PageInfo';
import PageTerms from './components/PageTerms';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="App-inner">
          <AppHeader />
          <main className="App-main">
            <Routes>
              <Route
                exact
                path="/"
                element={<PageHome />}
              />
              <Route
                exact
                path="/mint"
                element={<PageMint />}
              />
              <Route
                exact
                path="/info"
                element={<PageInfo />}
              />
              <Route
                exact
                path="/terms"
                element={<PageTerms />}
              />
            </Routes>
          </main>
        </div>
        <AppFooter className="App-footer" />
      </div>
    </Router>
  );
}

export default App;
