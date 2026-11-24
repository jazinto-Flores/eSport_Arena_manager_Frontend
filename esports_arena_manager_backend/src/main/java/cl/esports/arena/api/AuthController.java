package cl.esports.arena.api;
import cl.esports.arena.model.*;import cl.esports.arena.repo.*;
import org.springframework.http.*;import org.springframework.web.bind.annotation.*;import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.*;import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import java.time.*;import java.util.*;
@RestController @RequestMapping("/api/auth")
public class AuthController {
 private final UsuarioRepository repo; private final PasswordEncoder hashes; private final JwtEncoder encoder;private final JwtDecoder refreshDecoder;
 public AuthController(UsuarioRepository repo,PasswordEncoder hashes,JwtEncoder encoder,javax.crypto.SecretKey key){this.repo=repo;this.hashes=hashes;this.encoder=encoder;this.refreshDecoder=NimbusJwtDecoder.withSecretKey(key).macAlgorithm(MacAlgorithm.HS256).build();}
 public record Credenciales(String email,String password){} public record Registro(String nombre,String email,String password){}
 public record Sesion(String token,String refreshToken,String rol,String nombre,String email){}
 @PostMapping("/registro") public ResponseEntity<?> registro(@RequestBody Registro x){
  if(x.nombre()==null||x.nombre().isBlank()||x.email()==null||!x.email().matches("(?i)^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")||x.password()==null||x.password().length()<8) throw new IllegalArgumentException("Nombre, correo válido y contraseña de al menos 8 caracteres son obligatorios");
  if(repo.findByEmailIgnoreCase(x.email()).isPresent())return ResponseEntity.status(409).body(Map.of("mensaje","Correo ya registrado"));
  var u=new Usuario();u.nombre=x.nombre().trim();u.email=x.email().trim().toLowerCase();u.passwordHash=hashes.encode(x.password());u.rol="JUGADOR";repo.save(u);return ResponseEntity.status(201).body(Map.of("id",u.id,"email",u.email,"rol",u.rol));
 }
 @PostMapping("/login") public Sesion login(@RequestBody Credenciales x){var u=repo.findByEmailIgnoreCase(x.email()==null?"":x.email()).orElseThrow(()->new SecurityException("Credenciales inválidas"));if(!hashes.matches(x.password()==null?"":x.password(),u.passwordHash))throw new SecurityException("Credenciales inválidas");return sesion(u);}
 @PostMapping("/refresh") public Sesion refresh(@RequestBody Map<String,String> body){String raw=body.get("refreshToken");if(raw==null)throw new SecurityException("Falta token");try{Jwt jwt=refreshDecoder.decode(raw);if(!"refresh".equals(jwt.getClaimAsString("tipo")))throw new SecurityException("Token incorrecto");var u=repo.findByEmailIgnoreCase(jwt.getSubject()).orElseThrow(()->new SecurityException("Usuario inexistente"));return sesion(u);}catch(JwtException ex){throw new SecurityException("Token inválido");}}
 private Sesion sesion(Usuario u){return new Sesion(token(u,"access",3600),token(u,"refresh",604800),u.rol,u.nombre,u.email);}
 private String token(Usuario u,String tipo,long sec){var now=Instant.now();var claims=JwtClaimsSet.builder().issuer("esports-arena").subject(u.email).issuedAt(now).expiresAt(now.plusSeconds(sec)).claim("rol",u.rol).claim("tipo",tipo).build();return encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(),claims)).getTokenValue();}
}
