package ip.studentplatform.service;

import ip.studentplatform.entity.Grade;
import ip.studentplatform.entity.Materie;
import ip.studentplatform.entity.Student;
import ip.studentplatform.repository.ICrudRepositoryGrades;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradesService {
    @Autowired
    ICrudRepositoryGrades iCrudRepositoryGrades;

    public void approvedGrades(String firstName, String lastName, String materie) {
        this.iCrudRepositoryGrades.approvedGrades(firstName, lastName, materie);
    }

    public void addGrades(Grade grade) {
        this.iCrudRepositoryGrades.save(grade);
    }

    public int updateGrade(int grade, Student student, Materie materie) {
        return this.iCrudRepositoryGrades.updateGrade(grade, student, materie);
    }

    public List<Grade> getGradeForAdmin(Student student) {
        return this.iCrudRepositoryGrades.getGradeForAdmin(student);
    }

    public List<Grade> getGrades(Student student) {
        return this.iCrudRepositoryGrades.getGrades(student);
    }

    public List<Grade> getGradesByMaterie(Materie materie) {
        return this.iCrudRepositoryGrades.getGradesByMaterie(materie);
    }
}
