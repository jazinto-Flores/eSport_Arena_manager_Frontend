package cl.esports.arena.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
@Entity @Table(name="torneos")
public class Torneo {
 @Id public String id;
 @NotBlank public String nombre;
 @NotBlank public String juego;
 public String estado="ABIERTO";
 @Min(1) public int cuposMaximos;
 @Min(0) public int inscritos;
 @Min(1) public int integrantesMinimos;
 public String cierreInscripcion;
 @Version public Long version;
}
