package cl.esports.arena.repo;
import cl.esports.arena.model.Torneo;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TorneoRepository extends JpaRepository<Torneo,String> {  }
