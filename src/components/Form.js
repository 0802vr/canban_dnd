import React from "react";

function Form(props) {
  const info = React.useRef();
  const [submit, setSubmit] = React.useState(false);
  React.useEffect(() => {
    info.current.value = "";
  }, [submit]);
  const { row, newCard, addNewCard} = props;
  function infoSubmit(e) {
    e.preventDefault();
    
     
    const text = info.current.value;
    if (!text) {
      setSubmit(true);

      return;
    }
   

     newCard({
      row: row,
      text: text,
    });
    setSubmit(true);
    addNewCard(row, text);
    //cards, columns, setColumns, idCard
  }
  /* function addNewCard(row, text, cards, columns, setColumns, idCard){
     console.log(cards)
    let num = Number(row)
    
        /* console.log(idCard)
        const column = columns[num];
        console.log(column)
        const newTaskIds = Array.from(column.items);
        newTaskIds.push(idCard); 
        console.log(newTaskIds) */

        /* setColumns({
                ...columns,
                [num]: {
                    ...columns,
                    items: newTaskIds
                }
            }
        );   */
        //idCard=null
  

  return (
    <form className="table__form">
      <textarea
        className="table__input"
        data-text="Опишите задачу"
        type="text"
        ref={info}
      ></textarea>

      <button onClick={infoSubmit} className="table__button">
        Создать
      </button>
    </form>
  );
}
export default Form;
