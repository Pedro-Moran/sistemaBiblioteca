package com.miapp.repository;

import com.miapp.model.Pais;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface PaisRepository extends JpaRepository<Pais, String> { }
