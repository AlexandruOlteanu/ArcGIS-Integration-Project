package ip.studentplatform.controller;

import ip.studentplatform.entity.Student;
import ip.studentplatform.entity.User;
import ip.studentplatform.service.EmailSenderService;
import ip.studentplatform.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    private EmailSenderService senderService;
    @PreAuthorize("hasAuthority('admin')")
    @PostMapping("/upload-customers-data")
    public void uploadCustomersData(@RequestParam("file") MultipartFile file){
        List<User> users = this.userService.saveCustomersToDatabase(file);
        for(User user:users) {
            senderService.sendSimpleEmail(user.getEmail(),
                    "StudentPlatform",
                    "USER: "+ user.getUsername() +"\nPassword:"+user.getInitialPassword());
        }
    }

    @GetMapping("/getUser")
    public User getUserByUsername(@RequestParam(name = "name") String name) {
        return this.userService.getUser(name);
    }

    @GetMapping("/getListStudents")
    public List<Student> getStudentsList() {
        return this.userService.getStudentList();
    }

    @GetMapping("/addBirthday")
    public int addBirthday(@RequestParam(name = "birthday") String birthday, Principal principal) {
        Student student = (Student) this.userService.getUser(principal.getName());
        return this.userService.addBirthday(birthday, student.getFirstName(), student.getLastName());
    }

    @GetMapping("/addCnp")
    public int addCnp(@RequestParam(name = "cnp") String cnp, Principal principal) {
        Student student = (Student) this.userService.getUser(principal.getName());
        return this.userService.addCnp(cnp, student.getFirstName(), student.getLastName());
    }

    @GetMapping("/phoneNumber")
    public int addPhoneNumber(@RequestParam(name = "phoneNumber") String phoneNumber, Principal principal) {
        Student student = (Student) this.userService.getUser(principal.getName());
        return this.userService.addPhoneNumber(phoneNumber, student.getFirstName(), student.getLastName());
    }

    @GetMapping("/dorm")
    public int addDorm(@RequestParam(name = "dorm") String dorm, Principal principal) {
        Student student = (Student) this.userService.getUser(principal.getName());
        return this.userService.addDorm(dorm, student.getFirstName(), student.getLastName());
    }

    @GetMapping("/room")
    public int addCamin(@RequestParam(name = "room") String room, Principal principal) {
        Student student = (Student) this.userService.getUser(principal.getName());
        return this.userService.addRoom(room, student.getFirstName(), student.getLastName());
    }

    @GetMapping("/highSchool")
    public int addHighSchool(@RequestParam(name = "highSchool") String highSchool, Principal principal) {
        Student student = (Student) this.userService.getUser(principal.getName());
        return this.userService.addHighSchool(highSchool, student.getFirstName(), student.getLastName());
    }

    @GetMapping("/iban")
    public int addIban(@RequestParam(name = "iban") String iban, Principal principal) {
        Student student = (Student) this.userService.getUser(principal.getName());
        return this.userService.addIban(iban, student.getFirstName(), student.getLastName());
    }
    @PostMapping("/putData")
    public void updateData(@RequestParam(name = "highSchool") String highSchool,
                      @RequestParam(name = "room") String room,
                      @RequestParam(name = "dorm") String dorm,
                      @RequestParam(name = "phoneNumber") String phoneNumber,
                      @RequestParam(name = "cnp") String cnp,
                      @RequestParam(name = "birthday") String birthday,
                      @RequestParam(name = "iban") String iban,
                      Principal principal) {
        Student student = (Student) this.userService.getUser(principal.getName());
        this.userService.addIban(iban, student.getFirstName(), student.getLastName());
        this.userService.addHighSchool(highSchool, student.getFirstName(), student.getLastName());
        this.userService.addRoom(room, student.getFirstName(), student.getLastName());
        this.userService.addDorm(dorm, student.getFirstName(), student.getLastName());
        this.userService.addPhoneNumber(phoneNumber, student.getFirstName(), student.getLastName());
        this.userService.addCnp(cnp, student.getFirstName(), student.getLastName());
        this.userService.addBirthday(birthday, student.getFirstName(), student.getLastName());
    }

    @PostMapping("/resetPassword")
    public void changePasswordEmail(@RequestParam("email") String email,
                                    @RequestParam("username") String username,
                                    HttpServletRequest request) {
        User user = this.userService.getUser(username);

        String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder(8);
        for(int i = 0; i < 8; ++i) {
            sb.append(AB.charAt(rnd.nextInt(AB.length())));
        }
        this.userService.updatePassword(user, new BCryptPasswordEncoder().encode(sb.toString()));
        senderService.sendSimpleEmail(user.getEmail(),
                "StudentPlatform",
                "Reset password:" + sb.toString() + "\n");
    }

    @GetMapping("/getUserProf")
    public User getUserProf(Principal principal) {
        return this.userService.getUser(principal.getName());
    }

    @GetMapping("/getUserStudent")
    public User getUserStudent(Principal principal) {
        return this.userService.getUser(principal.getName());
    }
}
