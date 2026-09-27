import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { TodosRoutingModule } from './todos-routing.module';

@NgModule({
  declarations: [TodoListComponent, TodoItemComponent, TodoFormComponent],
  imports: [SharedModule, ReactiveFormsModule, TodosRoutingModule],
})
export class TodosModule {}
