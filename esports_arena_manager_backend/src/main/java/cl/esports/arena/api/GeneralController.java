package cl.esports.arena.api;
import cl.esports.arena.repo.*;
import org.springframework.web.bind.annotation.*;import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.http.*;import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.*;
@RestController public class GeneralController {
 private final SancionRepository repo;public GeneralController(SancionRepository repo){this.repo=repo;}
 @GetMapping("/api/health")public Map<String,String> health(){return Map.of("estado","ok","servicio","esports-arena-springboot");}
 @GetMapping("/api/jugadores/{apodo}")public Map<String,Object> jugador(@PathVariable String apodo){return Map.of("apodo",apodo,"sancionado",repo.existsByApodoIgnoreCaseAndActivaTrue(apodo));}
 @GetMapping("/api/auth/me")public Map<String,String> me(JwtAuthenticationToken token){return Map.of("email",token.getName(),"rol",token.getToken().getClaimAsString("rol"));}
 @ExceptionHandler({IllegalArgumentException.class,IllegalStateException.class})public ResponseEntity<?> bad(RuntimeException e){return ResponseEntity.badRequest().body(Map.of("mensaje",e.getMessage()));}
 @ExceptionHandler(SecurityException.class)public ResponseEntity<?> unauthorized(SecurityException e){return ResponseEntity.status(401).body(Map.of("mensaje",e.getMessage()));}
 @ExceptionHandler(NoSuchElementException.class)public ResponseEntity<?> missing(NoSuchElementException e){return ResponseEntity.status(404).body(Map.of("mensaje","Recurso no encontrado"));}
}
