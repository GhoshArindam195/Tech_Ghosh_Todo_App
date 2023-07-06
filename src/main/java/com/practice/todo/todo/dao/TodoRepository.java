package com.practice.todo.todo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.practice.todo.todo.entity.Todo;
import com.practice.todo.todo.entity.User;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUser(User user);
    
    @Query("SELECT t FROM Todo t ORDER BY t.deadline ASC")
    List<Todo> findAllOrderByDeadlineAsc();

    @Query(
        nativeQuery = true,
        value = "SELECT * FROM todo t where t.status=?1 ORDER BY t.deadline ASC"
        )
    List<Todo> findActiveTodosOrderByDeadlineAsc(String status);
}
