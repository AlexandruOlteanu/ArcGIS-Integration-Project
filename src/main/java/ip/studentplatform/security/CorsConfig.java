package ip.studentplatform.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200") // Replace with the allowed origin(s) for your Angular app
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Replace with the allowed HTTP methods
                .allowedHeaders("*") // Replace with the allowed headers
                .allowCredentials(true); // Set to true if you want to allow credentials (e.g., cookies)
    }
}
