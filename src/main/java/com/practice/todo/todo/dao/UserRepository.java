package com.practice.todo.todo.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.practice.todo.todo.entity.User;

public interface UserRepository extends JpaRepository<User, Long>{

    User findByUsername(String username);
    
}
