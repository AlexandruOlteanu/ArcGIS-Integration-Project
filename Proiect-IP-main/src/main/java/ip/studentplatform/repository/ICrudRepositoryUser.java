package ip.studentplatform.repository;

import ip.studentplatform.entity.*;
import jakarta.transaction.Transactional;
import org.apache.xmlbeans.impl.xb.xsdschema.Attribute;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Transactional
public interface ICrudRepositoryUser extends CrudRepository<User, Integer>{
    @Query("SELECT c FROM Student c WHERE c.username like %?1")
    public User getStudentByUsername(@Param("username") String username);

    @Query("SELECT c FROM Professor c WHERE c.username like %?1")
    public User getProfessorByUsername(@Param("username") String username);

    @Query("SELECT c FROM Professor c WHERE c.username=:name")
    public User getProfessorByName(@Param("name") String name);

    @Query("SELECT c FROM Admin c WHERE c.username like %?1")
    public User getAdminByUsername(@Param("username") String username);

    @Query("SELECT s FROM Professor s")
    public List<Professor> getAll();

    @Modifying
    @Query("UPDATE Professor u SET u.materies =:materieList WHERE u.firstName=:name")
    int updateProfessor(String name, List<Materie> materieList);

    @Query("SELECT c.materies FROM Professor c WHERE c.username=:name")
    List<Materie> getMaterieByNameProfessor(String name);

    @Query("SELECT s FROM Student s")
    public List<Student> getAllStudent();

    @Modifying
    @Query("UPDATE Student s SET s.birthDay =:birthday WHERE s.firstName =:firstname and s.lastName =:lastname")
    int addBirthday(String birthday, String firstname, String lastname);

    @Modifying
    @Query("UPDATE Student s SET s.cnp =:cnp WHERE s.firstName =:firstname and s.lastName =:lastname")
    int addCnp(String cnp, String firstname, String lastname);

    @Modifying
    @Query("UPDATE Student s SET s.phone =:phoneNumber WHERE s.firstName =:firstname and s.lastName =:lastname")
    int addPhoneNumber(String phoneNumber, String firstname, String lastname);

    @Modifying
    @Query("UPDATE Student s SET s.dorm =:dorm WHERE s.firstName =:firstname and s.lastName =:lastname")
    int addDorm(String dorm, String firstname, String lastname);

    @Modifying
    @Query("UPDATE Student s SET s.room =:room WHERE s.firstName =:firstname and s.lastName =:lastname")
    int addRoom(String room, String firstname, String lastname);

    @Modifying
    @Query("UPDATE Student s SET s.highSchool =:highSchool WHERE s.firstName =:firstname and s.lastName =:lastname")
    int addHighSchool(String highSchool, String firstname, String lastname);

    @Modifying
    @Query("UPDATE Student s SET s.iban =:iban WHERE s.firstName =:firstname and s.lastName =:lastname")
    int addIban(String iban, String firstname, String lastname);

    @Query("SELECT s FROM Student s where s.firstName=:firstName and s.lastName=:lastName")
    Student getStudent(String firstName, String lastName);

    @Modifying
    @Query("UPDATE Student s SET s.password=:password where s.username=:username")
    int updatePasswordStudent(String password, String username);

    @Modifying
    @Query("UPDATE Professor s SET s.password=:password where s.username=:username")
    int updatePasswordProfessor(String password, String username);

    @Modifying
    @Query("UPDATE Admin s SET s.password=:password where s.username=:username")
    int updatePasswordAdmin(String password, String username);


    @Query("SELECT a FROM Admin a")
    List<Admin> getListAdmin();
}
