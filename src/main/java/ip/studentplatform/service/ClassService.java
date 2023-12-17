package ip.studentplatform.service;

import ip.studentplatform.entity.Materie;
import ip.studentplatform.entity.Professor;
import ip.studentplatform.entity.Student;
import ip.studentplatform.repository.ICrudRepositoryClass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassService {
    @Autowired
    ICrudRepositoryClass iCrudRepositoryClass;

    public void addStudentClass(String name, List<Materie> materieList) {
        System.out.println(this.iCrudRepositoryClass.addStudentClass(name, materieList));
    }

    public List<Materie> findListMaterie(String name) {
        return this.iCrudRepositoryClass.getMaterieByName(name);
    }

    public Materie getMaterie(String name) {
        return this.iCrudRepositoryClass.getMaterie(name);
    }

    public void updateMaterie(int id, Professor professor) {
        this.iCrudRepositoryClass.updateMaterie(id, professor);
    }

    public List<Materie> getListMaterie() {
        return this.iCrudRepositoryClass.getAllMaterie();
    }

    public int addFlagGrade(Student student, Materie materie, Boolean flag) {
        return this.iCrudRepositoryClass.addFlagGrade(student, materie, flag);
    }

    public Materie getMateriByID(int id) {
        return this.iCrudRepositoryClass.getMateriByID(id);
    }



}
