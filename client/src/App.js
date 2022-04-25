import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookstagramProvider from './providers/BookstagramProvider';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage/LandingPage';
import HomePage from './pages/HomePage/HomePage';
import './styles/root.scss';

const App = () => {
  return (
    <BookstagramProvider>
        <Router>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route
              path='/app/*'
              element={<PrivateRoute component={HomePage} />}
            />
          </Routes>
        </Router>
    </BookstagramProvider>
  );
}

export default App;
