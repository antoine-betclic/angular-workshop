import { Routes } from '@angular/router';
import { todosResolver } from '../../store/todos-resolver';
import { TodoForm } from './todo-form';
import { TodoList } from './todo-list';
import { todoResolver } from './todo-resolver';
import { unsavedChangesGuard } from './unsaved-changes-guard';

export default [
  { path: '', component: TodoList, resolve: { todos: todosResolver } },
  { path: 'new', component: TodoForm, canDeactivate: [unsavedChangesGuard] },
  {
    path: ':id',
    component: TodoForm,
    resolve: { todo: todoResolver },
    canDeactivate: [unsavedChangesGuard],
  },
] satisfies Routes;
