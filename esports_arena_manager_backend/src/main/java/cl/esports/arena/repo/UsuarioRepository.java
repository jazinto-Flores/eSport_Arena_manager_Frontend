package cl.esports.arena.repo;
import cl.esports.arena.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UsuarioRepository extends JpaRepository<Usuario,Long> { java.util.Optional<Usuario> findByEmailIgnoreCase(String email); }
