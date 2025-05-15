package com.Qoumis.SimpleApp.model;

import jakarta.persistence.*;

import com.Qoumis.SimpleApp.model.enums.AddressType;

@Entity
public class Address {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id", nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AddressType type; // HOME or WORK

    private String fullAddress;

    public Address() {
    
    }

    public Address(Long id, AddressType type, String fullAddress) {
        this.id = id;
        this.type = type;
        this.fullAddress = fullAddress;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public AddressType getType() {
        return type;
    }
    public void setType(AddressType type) {
        this.type = type;
    }

    public String getFullAddress() {
        return fullAddress;
    }
    public void setFullAddress(String fullAddress) {
        this.fullAddress = fullAddress;
    }
}
