package com.hms.microservices.patient.activity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name = "activities")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String text;

    @Column(name = "time_label", nullable = false)
    private String timeLabel;

    @Column(nullable = false)
    private String type;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Activity() {
    }

    public Activity(String text, String timeLabel, String type) {
        this.text = text;
        this.timeLabel = timeLabel;
        this.type = type;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public String getTimeLabel() {
        return timeLabel;
    }

    public String getType() {
        return type;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
