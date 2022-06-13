import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";

import Form from "./Form";
import Footer from "./Footer";

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
   
};

function Main(props) {
  const itemsFromBackend = [...props.cards];

//  console.log(itemsFromBackend);
  const columnsFromBackend = {
    '0': {
      name: "Задачи",
      items: itemsFromBackend.filter((el) => el.row == 0),
    },
    '1': {
      name: " В работе",
      items: itemsFromBackend.filter((el) => el.row == 1),
    },
    '2': {
      name: "Доделать",
      items: itemsFromBackend.filter((el) => el.row == 2),
    },
    '3': {
      name: "Готово",
      items: itemsFromBackend.filter((el) => el.row == 3),
    },
  };
 // console.log(columnsFromBackend);

  const [columns, setColumns] = useState(columnsFromBackend);

  const [clickOnText, setclickOnText] = useState(true);

  const info = React.useRef();

  function openList() {
    setclickOnText(false);
  }

  function onChangeCard() {
    console.log(info.current.innerText);

    const text = info.current.innerText;
    const { row, changeCard } = props;
    if (!text) {
      setclickOnText(true);
      // console.log(info.current.innerText)
      return;
    }
    setclickOnText(true);

    changeCard({
      row: row,
      text: info.current.innerText,
      id: props.card.id,
      seq_num: props.card.seq_num,
    });
  }
  function handleDeleteClick(item, columnId, index) {
  //  console.log(item, columnId, index);

    props.lostCard(item.id);
    const column = columns[columnId];
    const newTaskIds = Array.from(column.items);

    newTaskIds.splice(index, 1);

    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: newTaskIds,
      },
    });

   
  }
  function addNewCard(row, text) {
    const cardId = localStorage.getItem('card');
    
    const newTaskId = cardId;
    
    const column = columns[row];
    console.log(column)
    const newTaskIds = Array.from(column.items);
    
    console.log(newTaskIds)
    const newTask = {
        id: newTaskId,
        text: text, 
        row:row,

    }
    newTaskIds.push(newTask);
     
    setColumns({
      ...columns,
      [row]: {
          ...column,
          items: newTaskIds
      }
  }
      
    ); 
    console.log(columns);
    localStorage.removeItem("card");
  }

  return (
    <div className="content">
      <div
        className="table" /* style={{ display: "flex", justifyContent: "center", height: "100%" }} */
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "200px",
                }}
                key={columnId}
              >
                <h2>
                  {column.name} ({column.items.length}){" "}
                </h2>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? "lightblue"
                              : "lightgrey",
                            padding: 4,
                            width: 175,
                            minHeight: 350,
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="card"
                                      style={{
                                        userSelect: "none",

                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <div className="card__title">
                                        <div className="card__id">
                                          ID:{item.id}
                                        </div>
                                        <button
                                          type="button"
                                          className="card__close-container"
                                          onClick={() => {
                                            handleDeleteClick(
                                              item,
                                              columnId,
                                              index
                                            );
                                          }}
                                        ></button>
                                      </div>
                                      <div
                                        ref={info}
                                        onClick={openList}
                                        contentEditable={true}
                                        suppressContentEditableWarning={true}
                                        className="card__text"
                                      >
                                        {item.text}
                                      </div>
                                      {clickOnText ? null : (
                                        <button onClick={onChangeCard}>
                                          Нажми и сделай
                                        </button>
                                      )}
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                          <Form newCard={props.newCard}  row={columnId} addNewCard={addNewCard}/>
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
      <Footer />
    </div>
  );
}

export default Main;
