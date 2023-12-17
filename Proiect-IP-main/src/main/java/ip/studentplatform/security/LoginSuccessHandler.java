package ip.studentplatform.security;

import ip.studentplatform.entity.MyUserDetails;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws ServletException, IOException {

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();

        String redirectURL = request.getContextPath();

        if (userDetails.hasRole("admin")) {
            redirectURL = "http://localhost:4200/admin";
        } else if (userDetails.hasRole("student")) {
            redirectURL = "http://localhost:4200/student";
        } else if (userDetails.hasRole("profesor")) {
            redirectURL = "http://localhost:4200/professor";
        }
        response.sendRedirect(redirectURL);
    }
}
