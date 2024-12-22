import React from 'react'
import ReactDOM from 'react-dom'
import App from './App';
import Canvas from './Three'
import store from './redux/store'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'


ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Window />} />
            </Routes>

            {/* <Canvas /> */}

        </BrowserRouter>
    </Provider>

    , document.getElementById('root'))