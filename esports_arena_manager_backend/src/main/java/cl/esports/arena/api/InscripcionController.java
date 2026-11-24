package cl.esports.arena.api;
import cl.esports.arena.model.*;import cl.esports.arena.repo.*;
import org.springframework.http.*;import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import java.util.*;
@RestController @RequestMapping("/api/inscripciones")
public class InscripcionController {
 private final InscripcionRepository ins;private final TorneoRepository torneos;private final EquipoRepository equipos;private final SancionRepository sanciones;
 public InscripcionController(InscripcionRepository ins,TorneoRepository torneos,EquipoRepository equipos,SancionRepository sanciones){this.ins=ins;this.torneos=torneos;this.equipos=equipos;this.sanciones=sanciones;}
 public record Solicitud(String torneoId,String equipoId){}
 @GetMapping public List<Inscripcion> listar(JwtAuthenticationToken auth){return "ADMIN".equals(auth.getToken().getClaimAsString("rol"))?ins.findAll():ins.findByPropietarioEmail(auth.getName());}
 @PostMapping @Transactional public ResponseEntity<Inscripcion> inscribir(@RequestBody Solicitud dto,JwtAuthenticationToken auth){
  var t=torneos.findById(dto.torneoId()).orElseThrow(()->new NoSuchElementException("Torneo inexistente"));
  var e=equipos.findById(dto.equipoId()).orElseThrow(()->new NoSuchElementException("Equipo inexistente"));
  if(!e.propietarioEmail.equals(auth.getName())&&!"ADMIN".equals(auth.getToken().getClaimAsString("rol")))throw new org.springframework.security.access.AccessDeniedException("Equipo ajeno");
  if(!"ABIERTO".equalsIgnoreCase(t.estado)||t.inscritos>=t.cuposMaximos)throw new IllegalStateException("Inscripciones cerradas o sin cupos");
  if(!t.juego.equalsIgnoreCase(e.juego)||e.integrantes.size()<t.integrantesMinimos)throw new IllegalArgumentException("Juego o cantidad de integrantes incorrecta");
  if(e.integrantes.stream().anyMatch(i->sanciones.existsByApodoIgnoreCaseAndActivaTrue(i.apodo)))throw new IllegalArgumentException("Jugador sancionado");
  if(ins.existsByTorneoIdAndEquipoId(t.id,e.id))throw new IllegalStateException("Inscripción duplicada");
  var registro=new Inscripcion();registro.id=UUID.randomUUID().toString();registro.torneoId=t.id;registro.equipoId=e.id;registro.propietarioEmail=auth.getName();ins.save(registro);t.inscritos++;torneos.save(t);return ResponseEntity.status(201).body(registro);
 }
}
