import React, { Dispatch, FormEvent, useState, FocusEvent } from 'react';
import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';
import { ErrorMessage } from '../utils/helperFunctions';

interface Props {
  todo: Todo;
  onTodoId: Dispatch<React.SetStateAction<number | null>>;
  onErrorMessage: Dispatch<React.SetStateAction<ErrorMessage>>;
  onTodos: Dispatch<React.SetStateAction<Todo[]>>;
  onDeleteTodo: (targetId: number) => void;
}

export const TempTodoInput: React.FC<Props> = ({
  todo,
  onTodoId,
  onErrorMessage,
  onTodos,
  onDeleteTodo,
}) => {
  const [upgradeTitle, setUpgradeTitle] = useState(todo.title);

  const onSubmit = (
    event: FormEvent<HTMLFormElement> | FocusEvent<HTMLInputElement, Element>,
  ) => {
    event.preventDefault();

    if (todo.title !== upgradeTitle && upgradeTitle) {
      return updateTodo({ ...todo, title: upgradeTitle })
        .then(updatedTodo => {
          onTodos(currentTodos =>
            currentTodos.map(currentTodo =>
              currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
            ),
          );
        })
        .finally(() => {
          onTodoId(null);
        });
    }

    if (!upgradeTitle) {
      return onDeleteTodo(todo.id);
    }

    return onErrorMessage(ErrorMessage.update);
  };

  return (
    <form onSubmit={event => onSubmit(event)}>
      <input
        autoFocus
        onBlur={event => onSubmit(event)}
        value={upgradeTitle}
        onChange={event => setUpgradeTitle(event.target.value)}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
      />
    </form>
  );
};
