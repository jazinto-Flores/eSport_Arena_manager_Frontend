package cl.esports.arena.repo;
import cl.esports.arena.model.Sancion;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SancionRepository extends JpaRepository<Sancion,Long> { boolean existsByApodoIgnoreCaseAndActivaTrue(String apodo); }
