import React from 'react';
import { Provider } from 'jotai';
import App from './App';  // Assuming your main component is 'App'

export default function MainApp() {
  return (
    <Provider>
      <App />
    </Provider>
  );
}
