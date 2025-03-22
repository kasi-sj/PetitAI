import React from 'react'

const Todo = ({message}:{message:string}) => {
  return (
    <div className='todo-item p-2 border border-gray-300 rounded-md my-2 bg-gray-100 m-2'>
      <strong>TODO: </strong>{message}
    </div>
  )
}

export default Todo
