package com.Uday.service;

import com.Uday.config.JwtProvider;
import com.Uday.domain.VerificationType;
import com.Uday.model.TwoFactorAuth;
import com.Uday.model.User;
import com.Uday.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findUserProfileByJwt(String jwt) throws Exception {
        String email= JwtProvider.getEmailFromToken(jwt);
        User user=userRepository.findByEmail(email);

        if(user==null){
            throw new Exception("user not found");
        }
        return user;
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user=userRepository.findByEmail(email);

        if(user==null){
            throw new Exception("user not found");
        }
        return user;
    }

    @Override
    public User findUserById(Long userId) throws Exception {
        Optional<User> user=userRepository.findById(userId);
        if(user.isEmpty()){
            throw new Exception("User not found");
        }
        return user.get();
    }

    @Override
    public User enableTwoFactorAuthentication(VerificationType verificationType, String sendTo, User user) {
        TwoFactorAuth twoFactorAuth=new TwoFactorAuth();
        twoFactorAuth.setEnabled(true);
        twoFactorAuth.setSendTo(verificationType);
        user.setTwoFactorAuth(twoFactorAuth);
        return userRepository.save(user);
    }

    @Override
    public void disableTwoFactorAuth(Long userId) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        TwoFactorAuth twoFactorAuth = user.getTwoFactorAuth();
        if (twoFactorAuth != null) {
            twoFactorAuth.setEnabled(false);
            // Since User has a @OneToOne relationship with TwoFactorAuth with cascade,
            // saving the user will also save the changes to TwoFactorAuth.
            userRepository.save(user);
        } else {
            // Optional: Handle case where 2FA was never configured
            // but for a disable request, we can just consider the job done.
            System.out.println("2FA is not configured for this user, nothing to disable.");
        }
    }
    @Override
    public User updatePassword(User user, String newPassword) {
        user.setPassword(newPassword);
        return userRepository.save(user);
    }
}
