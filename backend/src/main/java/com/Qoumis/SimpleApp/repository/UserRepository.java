package com.Qoumis.SimpleApp.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.Qoumis.SimpleApp.model.User;
import com.Qoumis.SimpleApp.model.UserNameDTO;

import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT new com.Qoumis.SimpleApp.model.UserNameDTO(u.id, u.firstName, u.lastName) FROM User u")
    List<UserNameDTO> findNamesOnly();
}
