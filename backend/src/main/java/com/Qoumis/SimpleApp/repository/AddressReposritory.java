package com.Qoumis.SimpleApp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Qoumis.SimpleApp.model.Address;

//This repository is not really needed since addresses are configured automatically in the User entity
public interface AddressReposritory extends JpaRepository<Address, Long> {
    
}
