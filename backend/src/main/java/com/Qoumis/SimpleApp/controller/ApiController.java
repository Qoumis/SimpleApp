package com.Qoumis.SimpleApp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Qoumis.SimpleApp.repository.UserRepository;
import com.Qoumis.SimpleApp.service.UserService;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import jakarta.validation.Valid;

import java.util.List;
import com.Qoumis.SimpleApp.model.User;
import com.Qoumis.SimpleApp.model.UserNameDTO;
import com.Qoumis.SimpleApp.model.enums.AddressType;

import org.springframework.http.ResponseEntity;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class ApiController {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    //Get all users (all fields)
    @GetMapping("/user/all")
    public List<User> getUsers() {
        
        return userRepository.findAll();
    }

    //Get only the names of all users
    @GetMapping("/user/all/names")
    public List<UserNameDTO> getNamesOnly() {
        
        return userRepository.findNamesOnly();
    }

    //Get a user by ID
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        
        return userRepository.findById(id).<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(404).body("User not found"));
    }

    //Register a new user
    @PostMapping("/user/add")
    public User addUser(@Valid @RequestBody User user) {

        User sanitizedUser = userService.sanitizeUserInput(user);
        return userRepository.save(sanitizedUser);
    }

    //Update an existing user
    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateUser(@Valid @RequestBody User user, @PathVariable Long id){

        return userRepository.findById(id).<ResponseEntity<?>>
                map(existingUser ->{
                    existingUser.setFirstName(user.getFirstName());
                    existingUser.setLastName(user.getLastName());
                    existingUser.setGender(user.getGender());
                    existingUser.setBirthDate(user.getBirthDate());

                    userService.addressUpdater(existingUser.getHomeAddress(), user.getHomeAddress(), existingUser, AddressType.HOME);
                    userService.addressUpdater(existingUser.getWorkAddress(), user.getWorkAddress(), existingUser, AddressType.WORK);
                    
                    // Sanitize the updated user input for XSS prevention
                    User sanitizedUser = userService.sanitizeUserInput(existingUser);
                    return ResponseEntity.ok(userRepository.save(sanitizedUser));
                })
                .orElse(ResponseEntity.status(404).body("User not found"));
    }

    //Delete a user
    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id){
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
 
    
}
