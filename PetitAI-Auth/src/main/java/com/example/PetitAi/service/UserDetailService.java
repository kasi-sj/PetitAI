package com.example.PetitAi.service;

import com.example.PetitAi.entity.UserPrincipal;
import com.example.PetitAi.entity.Users;
import com.example.PetitAi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
public class UserDetailService implements UserDetailsService {

    @Autowired
    UserRepository repository;

    @Override  //default interface method must implement
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("Inside LOadUser");
        Optional<Users> user  = repository.findByEmail(email);
        System.out.println("User :"+user+email);
        if(user.isEmpty()){
            throw new UsernameNotFoundException("User not found");
        }
        //since this UserDetails will be the return type we are creating a class which implements that
        //currently we are returing a user detailed fetched from the DB to config,this data is used to verify the data from the request
        return new UserPrincipal(user.get());
    }


}
