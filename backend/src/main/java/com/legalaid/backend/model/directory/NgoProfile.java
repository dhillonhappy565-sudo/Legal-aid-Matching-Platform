package com.legalaid.backend.model.directory;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ngo_directory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NgoProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String externalId;
    private String name;
    private String state;

    @Column(nullable = true)
    private String specialization;
}
