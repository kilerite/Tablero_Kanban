// src/pages/HomePage.js

import React from 'react';
import KanbanBoard from '../components/KanbanBoard';

const HomePage = () => {
  return (
    <div>
      <h1>Tablero Kanban</h1>
      <KanbanBoard />
    </div>
  );
};

export default HomePage;
