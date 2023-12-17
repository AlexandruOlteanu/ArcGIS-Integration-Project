package ip.studentplatform.controller;

import ip.studentplatform.entity.Admin;
import ip.studentplatform.entity.Materie;
import ip.studentplatform.entity.Professor;
import ip.studentplatform.entity.Student;
import ip.studentplatform.service.ClassService;
import ip.studentplatform.service.EmailSenderService;
import ip.studentplatform.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/class")
public class ClassController {
    @Autowired
    ClassService classService;

    @Autowired
    UserService userService;

    @Autowired
    private EmailSenderService senderService;

    @PreAuthorize("hasAuthority('admin')")
    @PostMapping("/addStudent")
    public void addStudent(@RequestParam(name = "username") String name, @RequestParam(name = "subject") String subjectName) {
        List<Materie> subjects = this.classService.findListMaterie(name);
        Materie subject = this.classService.getMaterie(subjectName);
        for (Materie subjectSearch :subjects) {
            if(subjectSearch.getId_mat() == subject.getId_mat()) {
                return;
            }
        }
        if(subjects.size() == 0) {
            subjects = new ArrayList<Materie>();
        }
        subjects.add(subject);
        for (Materie subjectSearch :subjects) {
            System.out.println(subjectSearch);
        }
        System.out.println(name);
        //this.classService.addStudentClass(name, subjects);
    }

    @PreAuthorize("hasAuthority('admin')")
    @PostMapping("/addProfessorToClass")
    public void addProfessor(@RequestParam(name = "username") String name, @RequestParam(name = "subject") String subjectName) {
        Materie subject = this.classService.getMaterie(subjectName);
        List<Materie> subjects = this.userService.findListMaterieProfessor(name);
        this.classService.updateMaterie(subject.getId_mat(), this.userService.findByFirstname(name));
        subjects.add(subject);
    }

    @GetMapping("/getMaterie")
    public List<String> getAllMaterie() {
        List<Materie> materies = this.classService.getListMaterie();
        List<String> data = new ArrayList<>();
        for(Materie materie: materies) {
            data.add(materie.getNameMaterie());
        }
        return data;
    }

    @PreAuthorize("hasAuthority('student')")
    @PutMapping("/addFlag")
    public void putFlagGrade(@RequestParam("materie") String nameMaterie, Principal principal) {
        Student student = (Student) this.userService.getUser(principal.getName());
        Materie materie = this.classService.getMaterie(nameMaterie);
        this.classService.addFlagGrade(student, materie, false);
        List<Admin> adminList = this.userService.getListAdmin();
        for(Admin admin: adminList) {
            senderService.sendSimpleEmail(admin.getEmail(),
                    "Flag Grade",
                    "Student " + student.getFirstName() + " " + student.getLastName() + " flag Grade " + nameMaterie);
        }
        Professor professor = materie.getProfessor();
        if(professor != null) {
            senderService.sendSimpleEmail(professor.getEmail(),
                    "Flag Grade",
                    "Student " + student.getFirstName() + " " + student.getLastName() + " flag Grade " + nameMaterie);
        }
    }

    @GetMapping("/getMaterieName")
    public String getMateriName(@RequestParam("id") int id) {
        return this.classService.getMateriByID(id).getNameMaterie();
    }
}
