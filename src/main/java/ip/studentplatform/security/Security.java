package ip.studentplatform.security;

import ip.studentplatform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;


@Configuration
@EnableWebSecurity
public class Security {
    @Autowired
    private LoginSuccessHandler loginSuccessHandler;
    @Bean
    public UserDetailsService userDetailsService() {
        return new UserService();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }



    @Bean
    SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .authorizeHttpRequests()
                .requestMatchers("/user/resetPassword").permitAll()
                .and()
                .authorizeHttpRequests()
                .requestMatchers("/user/upload-customers-data").hasAnyAuthority("admin")
                .requestMatchers("/user/successful").permitAll()
                .requestMatchers("/class/addProfessorToClass").hasAnyAuthority("admin")
                .requestMatchers("/class/addStudent").hasAnyAuthority("admin")
                .requestMatchers("/user/successful").permitAll()
                .anyRequest().authenticated()
                .and()
                .exceptionHandling().accessDeniedPage("/403")
                .and()
                .formLogin().successHandler(loginSuccessHandler).permitAll()
                .and()
                .logout().permitAll().logoutSuccessUrl("http://localhost:4200/login")
                .invalidateHttpSession(true);
        return http.build();
    }
}

