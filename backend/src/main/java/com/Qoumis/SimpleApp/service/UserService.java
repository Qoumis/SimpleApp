package com.Qoumis.SimpleApp.service;

import org.springframework.stereotype.Service;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;

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

    
    public User sanitizeUserInput(User user) {
        user.setFirstName(sanitizeString(user.getFirstName()));
        user.setLastName(sanitizeString(user.getLastName()));

        if(user.getHomeAddress() != null) {
            user.getHomeAddress().setFullAddress(sanitizeString(user.getHomeAddress().getFullAddress()));
        }
        if(user.getWorkAddress() != null) {
            user.getWorkAddress().setFullAddress(sanitizeString(user.getWorkAddress().getFullAddress()));
        }

        return user;
    }
    
    //sanitize user input to prevent XSS attacks
    private String sanitizeString(String input) {
        if (input == null) 
            return null;
        
        return Jsoup.clean(input, Safelist.basic());
    }

}
