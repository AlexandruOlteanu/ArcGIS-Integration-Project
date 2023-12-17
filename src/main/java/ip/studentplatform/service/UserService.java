package ip.studentplatform.service;

import ip.studentplatform.entity.*;
import ip.studentplatform.repository.ICrudRepositoryUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    ICrudRepositoryUser iCrudRepositoryUser;

    public List<User> saveCustomersToDatabase(MultipartFile file) {
        ExcelUploadService excelUploadService = new ExcelUploadService();

        if (ExcelUploadService.isValidExcelFile(file)) {
            try {
                excelUploadService.getCustomersDataFromExcel(file.getInputStream());
                this.iCrudRepositoryUser.saveAll(excelUploadService.usersList);

            } catch (IOException e) {
                throw new IllegalArgumentException("The file is not a valid excel file");
            }
        }
        return excelUploadService.usersList;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = iCrudRepositoryUser.getStudentByUsername(username);
        if (user == null) {
            user = iCrudRepositoryUser.getProfessorByUsername(username);
        }
        if (user == null) {
            user = iCrudRepositoryUser.getAdminByUsername(username);
        }
        if (user == null) {
            throw new UsernameNotFoundException("Not found User");
        }

        return new MyUserDetails(user);
    }

    public Professor findByFirstname(String username) {
        return (Professor) this.iCrudRepositoryUser.getProfessorByName(username);
    }

    public void updateProfessor(String username, List<Materie> materies) {
        this.iCrudRepositoryUser.updateProfessor(username, materies);
    }

    public List<Materie> findListMaterieProfessor(String name) {
        return this.iCrudRepositoryUser.getMaterieByNameProfessor(name);
    }

    public User getUser(String name) {
        User user = null;

        user = this.iCrudRepositoryUser.getProfessorByName(name);
        if(user == null) {
            user = this.iCrudRepositoryUser.getStudentByUsername(name);
        }
        if(user == null) {
            user = this.iCrudRepositoryUser.getAdminByUsername(name);
        }
        return user;
    }

    public List<Student> getStudentList() {
        return this.iCrudRepositoryUser.getAllStudent();
    }

    public int addBirthday(String birthday, String firstname, String lastname) {
        return this.iCrudRepositoryUser.addBirthday(birthday, firstname, lastname);
    }

    public int addCnp(String cnp, String firstname, String lastname) {
        return this.iCrudRepositoryUser.addCnp(cnp, firstname, lastname);
    }

    public int addPhoneNumber(String phoneNumber, String firstname, String lastname) {
        return this.iCrudRepositoryUser.addPhoneNumber(phoneNumber, firstname, lastname);
    }

    public int addDorm(String dorm, String firstname, String lastname) {
        return this.iCrudRepositoryUser.addDorm(dorm, firstname, lastname);
    }

    public int addRoom(String room, String firstname, String lastname) {
        return this.iCrudRepositoryUser.addRoom(room, firstname, lastname);
    }

    public int addHighSchool(String highSchool, String firstname, String lastname) {
        return this.iCrudRepositoryUser.addHighSchool(highSchool, firstname, lastname);
    }

    public int addIban(String iban, String firstname, String lastname) {
        return this.iCrudRepositoryUser.addIban(iban, firstname, lastname);
    }

    public Student getStudent(String firstName, String lastName) {
        return this.iCrudRepositoryUser.getStudent(firstName, lastName);
    }

    public int updatePassword(User user, String newPassword) {

        if(user.getRole().equals("admin")) {
            System.out.println(user.getUsername());
            System.out.println(newPassword);
            return this.iCrudRepositoryUser.updatePasswordAdmin(newPassword, user.getUsername());
        } else if(user.getRole().equals("student")) {
            System.out.println(user.getUsername());
            System.out.println(newPassword);
            return this.iCrudRepositoryUser.updatePasswordStudent(newPassword, user.getUsername());
        } else if(user.getRole().equals("profesor")) {
            System.out.println(user.getUsername());
            System.out.println(newPassword);
            return this.iCrudRepositoryUser.updatePasswordProfessor(newPassword, user.getUsername());
        }
        return 0;
    }

    public List<Admin> getListAdmin() {
        return this.iCrudRepositoryUser.getListAdmin();
    }
}
