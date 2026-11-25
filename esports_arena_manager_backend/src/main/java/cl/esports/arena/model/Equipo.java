package cl.esports.arena.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.util.*;
@Entity @Table(name="equipos")
public class Equipo {
 @Id public String id;
 @NotBlank public String nombre;
 @NotBlank public String juego;
 @Column(nullable=false) public String propietarioEmail;
 @ElementCollection(fetch=FetchType.EAGER) @CollectionTable(name="equipo_integrantes", joinColumns=@JoinColumn(name="equipo_id"))
 public List<Integrante> integrantes=new ArrayList<>();
 @Embeddable public static class Integrante { public String apodo; public String rol; public Integrante() {} public Integrante(String apodo,String rol){this.apodo=apodo;this.rol=rol;} }
}
