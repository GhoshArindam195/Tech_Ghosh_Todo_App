package com.practice.todo.todo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String task;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdOn;
    
    private LocalDateTime deadline;
    
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TaskStatus status=TaskStatus.ACTIVE;

    @Builder.Default
    private int delayCount=0;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    // Constructors, getters, and setters

    // You can define an @PrePersist method to set the createdOn attribute automatically
    @PrePersist
    protected void onCreate() {
        createdOn = LocalDateTime.now();
    }
    
}
