import './App.css';
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import PageHome from './PageHome';
import PageMint from './PageMint';
import PageInfo from './PageInfo';
import PageTerms from './PageTerms';

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
