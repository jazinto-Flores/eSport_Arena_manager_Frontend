package cl.esports.arena.api;
import cl.esports.arena.model.*;import cl.esports.arena.repo.*;
import org.springframework.web.bind.annotation.*;import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.http.*;
import java.util.*;
@RestController @RequestMapping("/api/torneos")
public class TorneoController {
 private final TorneoRepository repo;
 public TorneoController(TorneoRepository repo){this.repo=repo;}
 @GetMapping public List<Torneo> todos(){return repo.findAll();}
 @GetMapping("/{id}") public Torneo uno(@PathVariable String id){return repo.findById(id).orElseThrow(()->new NoSuchElementException("Torneo no encontrado"));}
 @PostMapping @PreAuthorize("hasRole('ADMIN')") public ResponseEntity<Torneo> crear(@RequestBody Torneo t){t.id=UUID.randomUUID().toString();t.inscritos=0;return ResponseEntity.status(201).body(repo.save(t));}
 @PutMapping("/{id}") @PreAuthorize("hasRole('ADMIN')") public Torneo editar(@PathVariable String id,@RequestBody Torneo dto){var t=uno(id);t.nombre=dto.nombre;t.juego=dto.juego;t.estado=dto.estado;t.cuposMaximos=dto.cuposMaximos;t.integrantesMinimos=dto.integrantesMinimos;t.cierreInscripcion=dto.cierreInscripcion;return repo.save(t);}
 @DeleteMapping("/{id}") @PreAuthorize("hasRole('ADMIN')") public void borrar(@PathVariable String id){repo.delete(uno(id));}
}
