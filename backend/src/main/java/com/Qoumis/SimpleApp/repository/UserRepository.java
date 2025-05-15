package com.Qoumis.SimpleApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Qoumis.SimpleApp.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

}
