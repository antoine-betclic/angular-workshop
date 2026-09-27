import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { todoResolver } from './todo.resolver';
import { unsavedChangesGuard } from './unsaved-changes.guard';

const routes: Routes = [
  { path: '', component: TodoListComponent },
  { path: 'new', component: TodoFormComponent, canDeactivate: [unsavedChangesGuard] },
  {
    path: ':id',
    component: TodoFormComponent,
    resolve: { todo: todoResolver },
    canDeactivate: [unsavedChangesGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodosRoutingModule {}
