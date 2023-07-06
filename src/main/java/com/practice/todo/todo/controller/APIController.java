package com.practice.todo.todo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.practice.todo.todo.dao.TodoRepository;
import com.practice.todo.todo.entity.TaskStatus;
import com.practice.todo.todo.entity.Todo;

@RestController
@RequestMapping("/api/todos")
public class APIController {

    @Autowired
    private TodoRepository todoRepository;

    @PostMapping("/save")
    public ResponseEntity<?> createTodo(@RequestBody Todo todoRequest) {
        try {
            // Create a new Todo object from the request data
            Todo todo = Todo.builder()
                    .task(todoRequest.getTask())
                    .deadline(todoRequest.getDeadline())
                    .status(todoRequest.getStatus())
                    .delayCount(0)
                    .build();

            // Save the todo in the database
            Todo createdTodo = todoRepository.save(todo);

            return new ResponseEntity<>(createdTodo.getId(), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create todo");
        }
    }

    @GetMapping({ "/all", "/", "" })
    public ResponseEntity<List<Todo>> getAllTodos() {
        try {
            List<Todo> todos = todoRepository.findAllOrderByDeadlineAsc();
            return ResponseEntity.ok(todos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping({ "/all/{status}"})
    public ResponseEntity<List<Todo>> getActiveTodos(@PathVariable String status) {
        try {
            
            List<Todo> todos = todoRepository.findActiveTodosOrderByDeadlineAsc(status.toLowerCase());
            System.out.println("------------------------------");
            System.out.println(todos);
            return ResponseEntity.ok(todos);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/remove/{id}")
public ResponseEntity<String> deleteTodoById(@PathVariable Long id) {
    try {
        // Check if the todo exists in the database
        if (todoRepository.existsById(id)) {
            // Get the todo object
            Todo todo = todoRepository.findById(id).get();
            // Update the status
            todo.setStatus(TaskStatus.CANCELLED);
            todoRepository.save(todo);
            return ResponseEntity.ok("Todo deleted successfully");
        } else {
            // Todo not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Todo not found");
        }
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete todo");
    }
}

@PutMapping("/update/{id}/{status}")
public ResponseEntity<String> updateTodoStatus(@PathVariable Long id, @PathVariable String status) {
    try {
        // Check if the todo exists in the database
        Optional<Todo> todoOptional = todoRepository.findById(id);
        if (todoOptional.isPresent()) {
            // Get the todo object
            Todo todo = todoOptional.get();
            // Update the status

            if(status.equalsIgnoreCase("completed"))
                todo.setStatus(TaskStatus.COMPLETED);
            // Save the updated todo in the database
            todoRepository.save(todo);
            return ResponseEntity.ok("Todo status updated successfully");
        } else {
            // Todo not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Todo not found");
        }
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update todo status");
    }
}



}
