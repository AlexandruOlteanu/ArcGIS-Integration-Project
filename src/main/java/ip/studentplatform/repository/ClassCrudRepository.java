package ip.studentplatform.repository;

import ip.studentplatform.entity.Materie;
import ip.studentplatform.entity.Professor;
import ip.studentplatform.entity.Student;
import ip.studentplatform.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Transactional
public interface ClassCrudRepository extends CrudRepository<User, Integer>, ICrudRepositoryClass {
    @Modifying
    @Query("UPDATE Student u SET u.materies=:materieList WHERE u.username=:name")
    int addStudentClass(String name, List<Materie> materieList);

    @Query("SELECT c.materies FROM Student c WHERE c.username=:name")
    List<Materie> getMaterieByName(String name);

    @Query("SELECT c FROM Materie c WHERE c.nameMaterie=:name")
    Materie getMaterie(String name);

    @Modifying
    @Query("UPDATE Materie m SET m.professor=:professor WHERE m.id_mat=:id")
    int updateMaterie(int id, Professor professor);

    @Query("SELECT m FROM Materie m")
    List<Materie> getAllMaterie();

    @Modifying
    @Query("UPDATE Grade g SET g.approvedGrade=:flag, g.flagGrade=true WHERE g.student=:student and g.materie =:materie")
    int addFlagGrade(Student student, Materie materie, Boolean flag);

    @Query("SELECT m FROM Materie m WHERE m.id_mat=:id")
    Materie getMateriByID(int id);
}
