package cl.esports.arena.model;
import jakarta.persistence.*;
@Entity @Table(name="usuarios",uniqueConstraints=@UniqueConstraint(columnNames="email"))
public class Usuario {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false) public String nombre;
 @Column(nullable=false) public String email;
 @Column(nullable=false) public String passwordHash;
 @Column(nullable=false) public String rol="JUGADOR";
}
