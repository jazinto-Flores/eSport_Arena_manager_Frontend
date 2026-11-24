package cl.esports.arena.model;
import jakarta.persistence.*;
import java.time.Instant;
@Entity @Table(name="inscripciones",uniqueConstraints=@UniqueConstraint(columnNames={"torneo_id","equipo_id"}))
public class Inscripcion {
 @Id public String id;
 @Column(name="torneo_id",nullable=false) public String torneoId;
 @Column(name="equipo_id",nullable=false) public String equipoId;
 @Column(nullable=false) public String propietarioEmail;
 public Instant fecha=Instant.now();
}
