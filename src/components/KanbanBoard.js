// src/components/KanbanBoard.js
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const initialTasks = {
  'todo': {
    name: 'Por Hacer',
    items: [
      { id: 'task-1', content: 'Estudiar React' },
      { id: 'task-2', content: 'Leer documentación de Redux' },
    ]
  },
  'in-progress': {
    name: 'En Proceso',
    items: [
      { id: 'task-3', content: 'Implementar Kanban en React' },
    ]
  },
  'done': {
    name: 'Hecho',
    items: [
      { id: 'task-4', content: 'Instalar dependencias' },
    ]
  }
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');

  const onDragEnd = (result, columns, setColumns) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newItems = Array.from(start.items);
      const [movedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedItem);

      const newColumn = {
        ...start,
        items: newItems,
      };

      setColumns({
        ...columns,
        [source.droppableId]: newColumn,
      });

    } else {
      const startItems = Array.from(start.items);
      const [movedItem] = startItems.splice(source.index, 1);
      const finishItems = Array.from(finish.items);
      finishItems.splice(destination.index, 0, movedItem);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...start,
          items: startItems,
        },
        [destination.droppableId]: {
          ...finish,
          items: finishItems,
        },
      });
    }
  };

  const addTask = () => {
    if (newTask.trim() === '') return;

    const newTaskItem = {
      id: `task-${Date.now()}`,  // Unique ID based on timestamp
      content: newTask,
    };

    const newTodoColumn = {
      ...columns['todo'],
      items: [newTaskItem, ...columns['todo'].items],
    };

    setColumns({
      ...columns,
      'todo': newTodoColumn,
    });

    setNewTask(''); // Clear input
  };

  const deleteTask = (columnId, taskId) => {
    const newItems = columns[columnId].items.filter(item => item.id !== taskId);

    const newColumn = {
      ...columns[columnId],
      items: newItems,
    };

    setColumns({
      ...columns,
      [columnId]: newColumn,
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nueva tarea..."
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button onClick={addTask} style={{ padding: '8px 16px' }}>Agregar Tarea</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
          {Object.entries(columns).map(([columnId, column]) => (
            <Droppable key={columnId} droppableId={columnId}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{
                    background: '#f4f4f4',
                    padding: '20px',
                    width: '30%',
                    minHeight: '400px',
                    borderRadius: '8px'
                  }}
                >
                  <h3>{column.name}</h3>
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            userSelect: 'none',
                            padding: '16px',
                            margin: '0 0 8px 0',
                            background: '#fff',
                            borderRadius: '4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            position: 'relative',
                            ...provided.draggableProps.style,
                          }}
                        >
                          {item.content}
                          <button
                            onClick={() => deleteTask(columnId, item.id)}
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '10px',
                              background: 'red',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              cursor: 'pointer',
                              textAlign: 'center',
                              lineHeight: '15px',
                            }}
                          >
                            X
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
