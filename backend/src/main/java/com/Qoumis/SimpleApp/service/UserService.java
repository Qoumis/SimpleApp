package com.Qoumis.SimpleApp.service;

import org.springframework.stereotype.Service;

import com.Qoumis.SimpleApp.model.User;
import com.Qoumis.SimpleApp.model.Address;
import com.Qoumis.SimpleApp.model.enums.AddressType;

@Service
public class UserService {
    
    //update existing address or set a new
    public void addressUpdater(Address addr, Address newAddr, User user,  AddressType type ) {
        
        if(addr != null && newAddr != null) // Update existing home address
            addr.setFullAddress(newAddr.getFullAddress());
        else{                                //replace old (null) with new or clear if new is null
            if(type == AddressType.HOME)
                user.setHomeAddress(newAddr);
            else 
                user.setWorkAddress(newAddr);
        }
    }

}
