package ip.studentplatform.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Setter
@Getter
@Entity
@Table(name = "materie")
public class Materie {
    @Id
    @Column(name = "id_mat")
    int id_mat;

    @Column(name = "name")
    String nameMaterie;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id")
    Professor professor;
}
