package cl.esports.arena.api;
import cl.esports.arena.model.*;import cl.esports.arena.repo.*;
import org.springframework.web.bind.annotation.*;import org.springframework.http.*;import java.util.*;
@RestController @RequestMapping("/api/admin/sanciones")
public class AdminController {private final SancionRepository repo;public AdminController(SancionRepository repo){this.repo=repo;}
 @GetMapping public List<Sancion> listar(){return repo.findAll();}
 @PostMapping public ResponseEntity<Sancion> crear(@RequestBody Sancion x){x.id=null;return ResponseEntity.status(201).body(repo.save(x));}
 @PutMapping("/{id}") public Sancion editar(@PathVariable Long id,@RequestBody Sancion x){var actual=repo.findById(id).orElseThrow();actual.apodo=x.apodo;actual.motivo=x.motivo;actual.activa=x.activa;return repo.save(actual);}
 @DeleteMapping("/{id}") public void eliminar(@PathVariable Long id){repo.deleteById(id);}
}
