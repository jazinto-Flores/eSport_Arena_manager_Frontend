package cl.esports.arena.config;
import cl.esports.arena.model.*;import cl.esports.arena.repo.*;
import org.springframework.boot.CommandLineRunner;import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
@Configuration public class SeedConfig {
 @Bean CommandLineRunner seed(TorneoRepository torneos,SancionRepository sanciones,UsuarioRepository usuarios,PasswordEncoder hash,@Value("${SEED_ADMIN_EMAIL:}") String adminEmail,@Value("${SEED_ADMIN_PASSWORD:}") String adminPassword){return args->{
  if(torneos.count()==0){var t=new Torneo();t.id="torneo-1";t.nombre="Copa de Verano LoL 5v5";t.juego="League of Legends";t.estado="ABIERTO";t.cuposMaximos=8;t.inscritos=0;t.integrantesMinimos=5;t.cierreInscripcion="2027-12-01";torneos.save(t);
   var v=new Torneo();v.id="torneo-2";v.nombre="Valorant Master Arena";v.juego="Valorant";v.estado="ABIERTO";v.cuposMaximos=16;v.integrantesMinimos=5;v.cierreInscripcion="2027-12-01";torneos.save(v);}
  if(sanciones.count()==0){var s=new Sancion();s.apodo="ToxicRage";s.motivo="Sanción de prueba";sanciones.save(s);}
  if(!adminEmail.isBlank()&&!adminPassword.isBlank()&&usuarios.findByEmailIgnoreCase(adminEmail).isEmpty()){
   var u=new Usuario();u.nombre="Administrador";u.email=adminEmail.toLowerCase();u.passwordHash=hash.encode(adminPassword);u.rol="ADMIN";usuarios.save(u);}
 };}
}
