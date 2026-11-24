package cl.esports.arena.repo;
import cl.esports.arena.model.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
public interface InscripcionRepository extends JpaRepository<Inscripcion,String> { boolean existsByTorneoIdAndEquipoId(String torneoId,String equipoId); java.util.List<Inscripcion> findByPropietarioEmail(String propietarioEmail); }
