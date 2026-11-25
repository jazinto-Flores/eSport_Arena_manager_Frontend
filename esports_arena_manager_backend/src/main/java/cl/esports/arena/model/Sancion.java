package cl.esports.arena.model;
import jakarta.persistence.*;
@Entity @Table(name="sanciones")
public class Sancion {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) public Long id;
 @Column(nullable=false) public String apodo;
 public boolean activa=true;
 public String motivo;
}
