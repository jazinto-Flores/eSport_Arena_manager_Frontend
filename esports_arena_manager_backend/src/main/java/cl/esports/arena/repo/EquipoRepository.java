package cl.esports.arena.repo;
import cl.esports.arena.model.Equipo;
import org.springframework.data.jpa.repository.JpaRepository;
public interface EquipoRepository extends JpaRepository<Equipo,String> { java.util.List<Equipo> findByPropietarioEmail(String propietarioEmail); }
