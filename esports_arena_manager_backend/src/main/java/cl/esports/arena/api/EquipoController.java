package cl.esports.arena.api;
import cl.esports.arena.model.*;import cl.esports.arena.repo.*;
import org.springframework.http.*;import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import java.util.*;
@RestController @RequestMapping("/api/equipos")
public class EquipoController {
 private final EquipoRepository repo;
 public EquipoController(EquipoRepository repo){this.repo=repo;}
 private boolean admin(JwtAuthenticationToken a){return "ADMIN".equals(a.getToken().getClaimAsString("rol"));}
 private Equipo propio(String id,JwtAuthenticationToken a){var e=repo.findById(id).orElseThrow(()->new NoSuchElementException("Equipo inexistente"));if(!admin(a)&&!e.propietarioEmail.equals(a.getName()))throw new org.springframework.security.access.AccessDeniedException("No autorizado");return e;}
 @GetMapping public List<Equipo> todos(JwtAuthenticationToken a){return admin(a)?repo.findAll():repo.findByPropietarioEmail(a.getName());}
 @GetMapping("/{id}") public Equipo uno(@PathVariable String id,JwtAuthenticationToken a){return propio(id,a);}
 @PostMapping public ResponseEntity<Equipo> crear(@RequestBody Equipo input,JwtAuthenticationToken a){validar(input);input.id=UUID.randomUUID().toString();input.propietarioEmail=a.getName();return ResponseEntity.status(201).body(repo.save(input));}
 @PutMapping("/{id}") public Equipo editar(@PathVariable String id,@RequestBody Equipo input,JwtAuthenticationToken a){validar(input);var e=propio(id,a);e.nombre=input.nombre;e.juego=input.juego;e.integrantes=input.integrantes;return repo.save(e);}
 @DeleteMapping("/{id}") public void eliminar(@PathVariable String id,JwtAuthenticationToken a){repo.delete(propio(id,a));}
 private void validar(Equipo e){if(e.nombre==null||e.nombre.isBlank()||e.juego==null||e.juego.isBlank()||e.integrantes==null||e.integrantes.isEmpty())throw new IllegalArgumentException("Nombre, juego e integrantes obligatorios");if(e.integrantes.stream().anyMatch(i->i.apodo==null||i.apodo.isBlank()))throw new IllegalArgumentException("Apodo inválido");long distintos=e.integrantes.stream().map(i->i.apodo.trim().toLowerCase()).distinct().count();if(distintos!=e.integrantes.size())throw new IllegalArgumentException("Integrantes duplicados");}
}
