package ip.studentplatform.repository;

import ip.studentplatform.entity.Grade;
import ip.studentplatform.entity.Materie;
import ip.studentplatform.entity.Student;
import ip.studentplatform.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

@Transactional
public interface GradesCrudRepository extends CrudRepository<Grade, Integer>, ICrudRepositoryGrades {
    @Modifying
    @Query("UPDATE Grade g SET g.approvedGrade = true WHERE g.student = (SELECT s FROM Student s WHERE s.firstName=:firstName and s.lastName=:lastName)" +
            "and g.materie=(SELECT m FROM Materie m where m.nameMaterie=:nameMaterie)")
    void approvedGrades(String firstName, String lastName, String nameMaterie);

    Grade save(Grade grade);

    @Modifying
    @Query("UPDATE Grade g SET g.grade=:grade, g.approvedGrade=false, g.flagGrade = false WHERE g.student=:student and g.materie=:materie")
    int updateGrade(int grade, Student student, Materie materie);

    @Query("SELECT g FROM Grade g WHERE g.student=:student and g.approvedGrade=false")
    List<Grade> getGradeForAdmin(Student student);

    @Query("SELECT g FROM Grade g WHERE g.student=:student and g.approvedGrade=true")
    List<Grade> getGrades(Student student);
    @Query("SELECT g FROM Grade g where g.materie=:materie and g.approvedGrade=false")
    List<Grade> getGradesByMaterie(Materie materie);
}
